function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function trackingBlock(trackingData) {
  if (!trackingData) {
    return "";
  }

  const acquisition = trackingData.acquisition || {};
  const pages = trackingData.visited_pages || [];

  const acquisitionHtml = `
    <h4>Kampanya / Kaynak</h4>
    <ul>
      <li><strong>Kaynak (Source):</strong> ${escapeHtml(acquisition.utm_source || "-")}</li>
      <li><strong>Araç (Medium):</strong> ${escapeHtml(acquisition.utm_medium || "-")}</li>
      <li><strong>Kampanya (Campaign):</strong> ${escapeHtml(acquisition.utm_campaign || "-")}</li>
      <li><strong>Terim (Term):</strong> ${escapeHtml(acquisition.utm_term || "-")}</li>
      <li><strong>İçerik (Content):</strong> ${escapeHtml(acquisition.utm_content || "-")}</li>
      <li><strong>GCLID (Google Ads):</strong> ${escapeHtml(acquisition.gclid || "-")}</li>
      <li><strong>GAD Source:</strong> ${escapeHtml(acquisition.gad_source || "-")}</li>
      <li><strong>GCLSRC:</strong> ${escapeHtml(acquisition.gclsrc || "-")}</li>
      <li><strong>DCLID:</strong> ${escapeHtml(acquisition.dclid || "-")}</li>
      <li><strong>FBCLID:</strong> ${escapeHtml(acquisition.fbclid || "-")}</li>
      <li><strong>MSCLKID:</strong> ${escapeHtml(acquisition.msclkid || "-")}</li>
      <li><strong>Referans (Referer):</strong> ${escapeHtml(acquisition.referer || "-")}</li>
      <li><strong>Giriş Sayfası:</strong> ${escapeHtml(acquisition.landing_page || "-")}</li>
      <li><strong>Zaman:</strong> ${escapeHtml(acquisition.timestamp || "-")}</li>
    </ul>
    ${!acquisition.utm_term && acquisition.gclid
      ? '<p style="font-size:12px;color:#666;font-style:italic;">Not: Google Ads, "Arama Terimi" (Keyword) bilgisini gizlilik nedeniyle otomatik olarak paylaşmaz. GCLID mevcut olduğu için bu ziyaret bir Google reklamından gelmiştir.</p>'
      : ""}
  `;

  const pagesHtml = pages.length
    ? `<h4>Ziyaret Edilen Sayfalar (Son 20)</h4><ul>${pages
        .map(
          (page) =>
            `<li style="font-size:12px;color:#666;"><span style="color:#999;">[${escapeHtml(page.timestamp)}]</span> ${escapeHtml(page.url)}</li>`,
        )
        .join("")}</ul>`
    : "";

  return `<hr style="border:0;border-top:1px solid #eee;margin:20px 0;"><h3>Ziyaretçi Takip Bilgileri</h3>${acquisitionHtml}${pagesHtml}`;
}

function productList(products = []) {
  return products
    .map((product) => {
      const extra = product.isFree ? "(Ücretsiz)" : `- ${escapeHtml(product.qty)} Adet`;
      const reason = product.reason ? ` - ${escapeHtml(product.reason)}` : "";
      return `<li><strong>${escapeHtml(product.name)}</strong>${reason} ${extra}</li>`;
    })
    .join("");
}

function quote(data, trackingData) {
  const userInfo = trackingData?.user_info || {};
  return `
    <h2>Yeni Teklif Talebi</h2>
    <p>Web sitesinden yeni bir teklif talebi alındı.</p>
    <h3>Müşteri Bilgileri</h3>
    <ul>
      <li><strong>Ad Soyad:</strong> ${escapeHtml(data.name)}</li>
      <li><strong>E-posta:</strong> ${escapeHtml(data.email)}</li>
      <li><strong>Telefon:</strong> ${escapeHtml(data.phone)}</li>
      <li><strong>Şirket:</strong> ${escapeHtml(data.company || "-")}</li>
      <li><strong>IP Adresi:</strong> ${escapeHtml(userInfo.ip || "-")}</li>
      <li><strong>Tarayıcı:</strong> ${escapeHtml(userInfo.user_agent || "-")}</li>
    </ul>
    <h3>Talep Edilen Ürünler</h3>
    <ul>${productList(data.products || [])}</ul>
    ${data.message ? `<h3>Mesaj</h3><p>${escapeHtml(data.message)}</p>` : ""}
    ${trackingBlock(trackingData)}
  `;
}

function parkingQuote(data, trackingData) {
  const userInfo = trackingData?.user_info || {};
  const methods = Array.isArray(data.payment_methods)
    ? data.payment_methods.map((item) => (item === "card" ? "Kart" : item === "hgs" ? "HGS" : item)).join(", ")
    : "Seçilmedi";

  return `
    <h2>Yeni Otopark Teklif Motoru Talebi</h2>
    <p>Web sitesindeki otopark teklif motoru üzerinden yeni bir talep alındı.</p>
    <h3>Müşteri Bilgileri</h3>
    <ul>
      <li><strong>Ad Soyad:</strong> ${escapeHtml(data.name)}</li>
      <li><strong>E-posta:</strong> ${escapeHtml(data.email)}</li>
      <li><strong>Telefon:</strong> ${escapeHtml(data.phone)}</li>
      <li><strong>Şirket:</strong> ${escapeHtml(data.company || "-")}</li>
      <li><strong>IP Adresi:</strong> ${escapeHtml(userInfo.ip || "-")}</li>
      <li><strong>Tarayıcı:</strong> ${escapeHtml(userInfo.user_agent || "-")}</li>
    </ul>
    <h3>Proje Tercihleri</h3>
    <ul>
      <li><strong>Senaryo:</strong> ${data.project_type === "paid" ? "Ücretli otopark" : "Sadece abonelik"}</li>
      <li><strong>Ödeme Kanalları:</strong> ${data.project_type === "paid" ? escapeHtml(methods || "Seçilmedi") : "Yok"}</li>
      <li><strong>Bariyer:</strong> ${data.needs_barrier ? "Evet" : "Hayır"}</li>
      <li><strong>Anahtar Teslim Kurulum:</strong> ${data.needs_turnkey_installation ? "Evet" : "Hayır"}</li>
    </ul>
    <h3>Önerilen Ürünler</h3>
    <ul>${productList(data.products || [])}</ul>
    ${data.message ? `<h3>Müşteri Notu</h3><p>${escapeHtml(data.message)}</p>` : ""}
    ${trackingBlock(trackingData)}
  `;
}

function discovery(data, trackingData) {
  return `
    <h2>Yeni Ücretsiz Keşif Talebi</h2>
    <p>Web sitesinden yeni bir ücretsiz keşif talebi alındı.</p>
    <h3>Müşteri Bilgileri</h3>
    <ul>
      <li><strong>Ad Soyad:</strong> ${escapeHtml(data.name)}</li>
      <li><strong>E-posta:</strong> ${escapeHtml(data.email)}</li>
      <li><strong>Telefon:</strong> ${escapeHtml(data.phone)}</li>
      <li><strong>Şirket:</strong> ${escapeHtml(data.company || "-")}</li>
    </ul>
    <h3>Adres Bilgileri</h3>
    <p>${escapeHtml(data.address)}</p>
    ${data.message ? `<h3>Ek Mesaj</h3><p>${escapeHtml(data.message)}</p>` : ""}
    ${trackingBlock(trackingData)}
  `;
}

function contact(data, trackingData) {
  const userInfo = trackingData?.user_info || {};
  return `
    <h2>Yeni İletişim Formu</h2>
    <p>Web sitesi iletişim sayfasından yeni bir mesaj alındı.</p>
    <h3>Müşteri Bilgileri</h3>
    <ul>
      <li><strong>Ad Soyad:</strong> ${escapeHtml(data.name)}</li>
      <li><strong>E-posta:</strong> ${escapeHtml(data.email)}</li>
      <li><strong>Telefon:</strong> ${escapeHtml(data.phone)}</li>
      <li><strong>Şirket:</strong> ${escapeHtml(data.company || "-")}</li>
      <li><strong>IP Adresi:</strong> ${escapeHtml(userInfo.ip || "-")}</li>
      <li><strong>Tarayıcı:</strong> ${escapeHtml(userInfo.user_agent || "-")}</li>
    </ul>
    ${data.message ? `<h3>Mesaj</h3><p>${escapeHtml(data.message)}</p>` : ""}
    ${trackingBlock(trackingData)}
  `;
}

export default { quote, parkingQuote, discovery, contact };
