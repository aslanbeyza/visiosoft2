/** tr-TR sayı biçimi; binlik ayırıcı varsayılan olarak yalnızca 10.000 ve üzeri sayılarda kullanılır. */
export const formatCount = (value: number, decimals = 0, grouping = Math.abs(value) >= 10000) =>
  value.toLocaleString('tr-TR', {
    useGrouping: grouping,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
