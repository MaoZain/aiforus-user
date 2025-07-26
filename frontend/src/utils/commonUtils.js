import {getAction, postAction} from '@/services/api';

/**
 * 获取字典数据
 * @param {string} dictType - 字典类型 (age, occupation, education)
 * @returns {Promise<Array>} 字典数据数组
 */
export const getDictByType = async (dictType) => {
  try {
    const response = await getAction(`/dictionary/${dictType}`);
    if (response.success) {
      return response.data || [];
    }
    throw new Error(response.message || 'Failed to fetch dictionary data');
  } catch (error) {
    console.error(`Error fetching ${dictType} dictionary:`, error);
    throw error;
  }
};