
export const formatCount = (value: number, decimals = 0, grouping = Math.abs(value) >= 10000) =>
  value.toLocaleString('tr-TR', {
    useGrouping: grouping,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
