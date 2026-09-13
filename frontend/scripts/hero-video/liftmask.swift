import Foundation
import Vision
import CoreGraphics
import ImageIO
import UniformTypeIdentifiers

func writeMask(_ pb: CVPixelBuffer, to url: URL) throws {
    CVPixelBufferLockBaseAddress(pb, .readOnly)
    defer { CVPixelBufferUnlockBaseAddress(pb, .readOnly) }
    let w = CVPixelBufferGetWidth(pb), h = CVPixelBufferGetHeight(pb)
    let fmt = CVPixelBufferGetPixelFormatType(pb)
    let bpr = CVPixelBufferGetBytesPerRow(pb)
    guard let base = CVPixelBufferGetBaseAddress(pb) else { throw NSError(domain: "mask", code: 1) }
    var bytes = [UInt8](repeating: 0, count: w * h)
    if fmt == kCVPixelFormatType_OneComponent32Float {
        for y in 0..<h {
            let row = base.advanced(by: y * bpr).assumingMemoryBound(to: Float.self)
            for x in 0..<w { bytes[y * w + x] = UInt8(max(0, min(255, row[x] * 255))) }
        }
    } else if fmt == kCVPixelFormatType_OneComponent8 {
        for y in 0..<h {
            let row = base.advanced(by: y * bpr).assumingMemoryBound(to: UInt8.self)
            for x in 0..<w { bytes[y * w + x] = row[x] }
        }
    } else {
        throw NSError(domain: "mask-format", code: Int(fmt))
    }
    let provider = CGDataProvider(data: Data(bytes) as CFData)!
    let img = CGImage(width: w, height: h, bitsPerComponent: 8, bitsPerPixel: 8, bytesPerRow: w,
                      space: CGColorSpaceCreateDeviceGray(), bitmapInfo: CGBitmapInfo(rawValue: 0),
                      provider: provider, decode: nil, shouldInterpolate: false, intent: .defaultIntent)!
    let dest = CGImageDestinationCreateWithURL(url as CFURL, UTType.png.identifier as CFString, 1, nil)!
    CGImageDestinationAddImage(dest, img, nil)
    CGImageDestinationFinalize(dest)
}

let args = CommandLine.arguments
guard args.count >= 3 else {
    FileHandle.standardError.write("usage: liftmask <in_dir> <out_dir>\n".data(using: .utf8)!)
    exit(1)
}
let inDir = URL(fileURLWithPath: args[1])
let outDir = URL(fileURLWithPath: args[2])
try? FileManager.default.createDirectory(at: outDir, withIntermediateDirectories: true)
let files = try FileManager.default.contentsOfDirectory(atPath: inDir.path)
    .filter { $0.lowercased().hasSuffix(".png") || $0.lowercased().hasSuffix(".jpg") }
    .sorted()
var done = 0
for f in files {
    let url = inDir.appendingPathComponent(f)
    let handler = VNImageRequestHandler(url: url, options: [:])
    let req = VNGenerateForegroundInstanceMaskRequest()
    do {
        try handler.perform([req])
        guard let obs = req.results?.first else { print("no-foreground \(f)"); continue }
        let mask = try obs.generateScaledMaskForImage(forInstances: obs.allInstances, from: handler)
        let name = (f as NSString).deletingPathExtension + ".png"
        try writeMask(mask, to: outDir.appendingPathComponent(name))
        done += 1
        if done % 25 == 0 { print("\(done)/\(files.count)") }
    } catch {
        print("error \(f): \(error)")
    }
}
print("done \(done)/\(files.count)")
