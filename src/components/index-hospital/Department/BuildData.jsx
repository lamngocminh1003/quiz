export const buildData = async (data) => {
  const uniqueRepoHashes = {};
  const uniqueArray = [];
  data?.forEach((item) => {
    const {
      repoHash,
      timestamp,
      stat,
      statName,
      categoryName,
      statId,
      categoryId,
      rating,
      hash,
      manifest,
      effectiveYear,
      unapprovedManifestCount,
      noteCount,
      unit,
      joinMode,
    } = item;
    if (!uniqueRepoHashes[repoHash]) {
      uniqueRepoHashes[repoHash] = [];
    }
    let existingObj = uniqueArray.find((obj) => obj.repoHash === repoHash);
    if (!existingObj) {
      existingObj = {
        repoHash: repoHash,
        effectiveYear: effectiveYear,
        manifest: manifest,
        unapprovedManifestCount: unapprovedManifestCount,
        statId: statId,
        categoryId: categoryId,
        statName: statName,
        categoryName: categoryName,
        unit: unit,
        noteCount: noteCount,
        joinMode: joinMode,
      };
      uniqueArray.push(existingObj);
    }
    existingObj[`stat${timestamp}`] = parseFloat(stat.toFixed(2)); // Làm tròn số stat
    existingObj[`R${timestamp}`] = rating;
    existingObj[`hash${timestamp}`] = hash;
    if (manifest !== null) {
      existingObj[`hashManifest`] = manifest.hash;
      existingObj[`repoHashManifest`] = manifest.repoHash;
      existingObj[`submittedByManifest`] = manifest.submittedBy;
      existingObj[`submittedOnManifest`] = manifest.submittedOn;
      existingObj[`criteriaManifest`] = manifest.criteria;
      existingObj[`formulaManifest`] = manifest.formula;
    } else {
      existingObj[`hashManifest`] = null;
      existingObj[`repoHashManifest`] = null;
      existingObj[`submittedByManifest`] = null;
      existingObj[`submittedOnManifest`] = null;
      existingObj[`criteriaManifest`] = null;
      existingObj[`formulaManifest`] = null;
    }
  });
  uniqueArray.sort((a, b) => a.effectiveYear - b.effectiveYear);
  return uniqueArray;
};
const adjustAverage = (data) => {
  const requiredKeys = ["Q1", "Q2", "Q3", "Q4"];
  requiredKeys.forEach((key) => {
    if (!data.hasOwnProperty(key)) {
      data[key] = {
        stat: null,
        rating: null,
      };
    }
  });

  return data;
};
export const buildDataGroupYearDepartment = (uniqueArray) => {
  if (uniqueArray.length > 0) {
    const transformedData = uniqueArray.map((item) => {
      const {
        statId,
        repoHashManifest,
        repoHash,
        manifest,
        hashQ1,
        hashQ2,
        hashQ3,
        hashQ4,
        hashKQ,
        hashManifest,
        formulaManifest,
        effectiveYear,
        criteriaManifest,
        categoryName,
        categoryId,
        statQ1,
        statQ2,
        statQ3,
        statQ4,
        statKQ,
        statName,
        RKQ,
        RQ1,
        RQ2,
        RQ3,
        RQ4,
      } = item;
      return {
        categoryId: categoryId,
        categoryName: categoryName,
        criteriaManifest: criteriaManifest,
        effectiveYear: effectiveYear,
        formulaManifest: formulaManifest,
        hashManifest: hashManifest,
        hashKQ: hashKQ ? hashKQ : null,
        hashQ4: hashQ4 ? hashQ4 : null,
        hashQ3: hashQ3 ? hashQ3 : null,
        hashQ2: hashQ2 ? hashQ2 : null,
        hashQ1: hashQ1 ? hashQ1 : null,
        manifest: manifest,
        repoHash: repoHash,
        repoHashManifest: repoHashManifest,
        statId: statId,
        statName: statName,
        average: {
          Q1: {
            stat: statQ1 !== undefined ? statQ1 : null,
            rating: RQ1 !== undefined ? RQ1 : null,
          },
          Q2: {
            stat: statQ2 !== undefined ? statQ2 : null,
            rating: RQ2 !== undefined ? RQ2 : null,
          },
          Q3: {
            stat: statQ3 !== undefined ? statQ3 : null,
            rating: RQ3 !== undefined ? RQ3 : null,
          },
          Q4: {
            stat: statQ4 !== undefined ? statQ4 : null,
            rating: RQ4 !== undefined ? RQ4 : null,
          },
          KQ: {
            stat: statKQ !== undefined ? statKQ : null,
            rating: RKQ !== undefined ? RKQ : null,
          },
        },
      };
    });
    let processedData = [];
    // Lặp qua mỗi đối tượng trong mảng minorStatDetails
    // Lặp qua từng đối tượng trong mảng dữ liệu của bạn
    transformedData.forEach((item) => {
      const { categoryId, categoryName, statName, effectiveYear, average } =
        item;
      // Tạo khóa chính dựa trên category và năm
      const key = `${categoryId}_${effectiveYear}`;
      // Kiểm tra xem đã có dữ liệu cho khóa này chưa
      if (!processedData[key]) {
        processedData[key] = {
          categoryId,
          categoryName,
          effectiveYear,
          stats: {},
        };
      }
      // Lưu trữ dữ liệu thống kê của mỗi loại statName trong category và năm tương ứng
      processedData[key].stats[statName] = average;
    });
    const groupedByStatId = transformedData.reduce((acc, item) => {
      const {
        categoryId,
        categoryName,
        statId,
        statName,
        effectiveYear,
        average,
      } = item;
      if (!acc[statId]) {
        acc[statId] = {
          categoryId,
          categoryName,
          statId,
          statName,
          data: [],
        };
      }
      acc[statId].data.push({
        effectiveYear,
        average: adjustAverage(average),
      });
      return acc;
    }, {});
    const groupedArrayByStatId = Object.values(groupedByStatId);
    return groupedArrayByStatId;
  }
};
export const buildDataGroupYearMajor = (data1) => {
  const data2 = {
    statId: data1[0]?.statId,
    statName: data1[0]?.statName,
    data: data1.map((item) => {
      const { effectiveYear, average } = item;
      return {
        effectiveYear,
        average: {
          Q1: {
            stat: average?.Q1?.stat,
            rating: average?.Q1?.rating,
          },
          Q2: {
            stat: average?.Q2?.stat,
            rating: average?.Q2?.rating,
          },
          Q3: {
            stat: average?.Q3?.stat,
            rating: average?.Q3?.rating,
          },
          Q4: {
            stat: average?.Q4?.stat,
            rating: average?.Q4?.rating,
          },
          KQ: {
            stat: average?.KQ?.stat,
            rating: average?.KQ?.rating,
          },
        },
      };
    }),
  };
  return data2;
};
export const buildDataPieChart = (data) => {
  // Tạo đối tượng thống kê
  const unitStats = [
    { name: "phút", value: 0, statNames: [] },
    { name: "giờ", value: 0, statNames: [] },
    { name: "ngày", value: 0, statNames: [] },
    { name: "%", value: 0, statNames: [] },
    { name: "", value: 0, statNames: [] },
    { name: "điểm", value: 0, statNames: [] },
    { name: "sự cố", value: 0, statNames: [] },
  ];

  // Lặp qua mảng dữ liệu và thống kê
  data.forEach((item) => {
    const { unit, statName } = item;

    // Tìm đối tượng có thuộc tính `label` bằng `unit`
    const foundUnit = unitStats.find((u) => u.name === unit);

    // Kiểm tra xem đối tượng có tồn tại không
    if (foundUnit) {
      // Thêm statName vào mảng của unit tương ứng và tăng số lượng
      foundUnit.statNames.push(statName);
      foundUnit.value++;
    }
  });
  return unitStats;
};
export const buildDataCategoryPieChart = (data, dataCategory) => {
  // Lặp qua mảng dữ liệu và thống kê
  data.forEach((item) => {
    const { categoryId, statName } = item;
    // Tìm đối tượng có thuộc tính `label` bằng `unit`
    const foundCategoryId = dataCategory.find(
      (u) => u.categoryId == categoryId
    );

    // Kiểm tra xem đối tượng có tồn tại không
    if (foundCategoryId) {
      // Thêm statName vào mảng của unit tương ứng và tăng số lượng
      foundCategoryId.statName.push(statName);
      foundCategoryId.value++;
    }
  });

  return dataCategory;
};
export const countYear = (data) => {
  const yearCounts = {};

  data.forEach((item) => {
    const { effectiveYear, statName } = item;

    if (!yearCounts[effectiveYear]) {
      // Nếu năm chưa có trong yearCounts, tạo mới mảng chỉ số và mảng statNames
      yearCounts[effectiveYear] = {
        count: 1,
        statNames: [statName],
      };
    } else {
      // Nếu năm đã có trong yearCounts, tăng số lần xuất hiện lên 1, thêm chỉ số và statName vào mảng
      yearCounts[effectiveYear].count += 1;
      yearCounts[effectiveYear].statNames.push(statName);
    }
  });

  // Chuyển đổi yearCounts thành mảng kết quả
  const newArray = Object.entries(yearCounts).map(
    ([year, { count, statNames }]) => ({
      name: parseInt(year),
      value: count,
      statNames: statNames,
    })
  );

  return newArray;
};
