import { asyncHandler } from "../middlewares/asyncHandler.js";
import { AppError } from "../utils/AppError.js";
import { getDictionaryByType } from "../models/dict.model.js";

// 获取特定类型的字典数据
export const getDictionaryData = asyncHandler(async (req, res) => {
  const { dictType } = req.params;

  // 从数据库获取字典数据
  const data = await getDictionaryByType(dictType);
  
  if (!data || data.length === 0) {
    throw new AppError(`No dictionary data found for type: ${dictType}`, 404, "DICT_NOT_FOUND");
  }

  // 按sort_order字段排序
  const sortedData = data.sort((a, b) => a.sort_order - b.sort_order);

  res.success(sortedData, `${dictType} dictionary retrieved successfully`);
});