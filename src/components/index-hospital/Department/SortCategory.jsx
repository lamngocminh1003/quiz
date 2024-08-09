export const specifiedOrder = [
  70, 71, 72, 83, 91, 92, 87, 88, 89, 90, 97, 86, 95, 96, 93, 94, 100, 78, 80,
  75, 76, 77, 73, 79, 74, 81, 82, 85, 84, 99, 98, 105, 107, 108, 104, 102, 103,
  106, 101, 63, 69, 68, 64, 65, 61, 62, 60, 66, 67,
];
const clamp = (num, min, max) => Math.min(Math.max(num, min), max);
// Loại bỏ ID 1, 2, 3 khỏi mảng categoryData
// Sắp xếp lại mảng categoryData theo thứ tự ID đã chỉ định
export const SortCategoryId = (arr) => {
  let result = [];
  let groupedData = arr.reduce((acc, obj) => {
    let key = obj.categoryId;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(obj);
    return acc;
  }, {});

  specifiedOrder.forEach((categoryId) => {
    let group = groupedData[categoryId];
    if (group) {
      group.sort((a, b) => a.statId - b.statId);
      result = result.concat(group);
      // Loại bỏ nhóm đã được xử lý để tránh lặp lại
      delete groupedData[categoryId];
    }
  });

  // Xử lý nhóm không có trong specifiedOrder
  Object.keys(groupedData).forEach((categoryId) => {
    let group = groupedData[categoryId];
    group.sort((a, b) => a.statId - b.statId);
    result = result.concat(group);
  });
  return result;
};
// Loại bỏ ID 1, 2, 3 khỏi mảng categoryData
// Sắp xếp lại mảng categoryData theo thứ tự ID đã chỉ định
export const SortCategoryIdById = (uniqueArray) => {
  uniqueArray.sort((a, b) => {
    const indexA = specifiedOrder.indexOf(a.id);
    const indexB = specifiedOrder.indexOf(b.id);
    if (indexA === -1 && indexB === -1) {
      // Nếu cả hai không có trong specifiedOrder, sắp xếp theo categoryId tăng dần
      if (a.id !== b.id) {
        return a.id - b.id;
      }
    } else if (indexA === -1) {
      return 1;
    } else if (indexB === -1) {
      return -1;
    } else {
      return indexA - indexB;
    }
  });
  return uniqueArray;
};
