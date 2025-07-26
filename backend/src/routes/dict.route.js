import express from 'express'
import { getDictionaryData } from '../controllers/dict.controller.js'
const router = express.Router()
/**
 * @swagger
 * /api/dict/getDict/{dictType}:
 *   get:
 *     summary: Get dictionary data by type
 *     tags: [Dictionary]
 *     parameters:
 *       - in: path
 *         name: dictType
 *         required: true
 *         schema:
 *           type: string
 *         description: The type of dictionary to retrieve
 *     responses:
 *       200:
 *         description: Dictionary data retrieved successfully
 *       404:
 *         description: Dictionary data not found for the specified type
 */
router.get('/getDictByType/:dictType', getDictionaryData)

export default router