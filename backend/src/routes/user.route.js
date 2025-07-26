import express from 'express'
import { getAllUsers, getUserByEmail,updateProfileByEmail,getLicenseByEmail } from '../controllers/user.controller.js'

const router = express.Router()

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management APIs
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: User ID
 *                     example: 1
 *                   username:
 *                     type: string
 *                     description: Username of the user
 *                     example: johndoe
 *                   role:
 *                     type: string
 *                     description: Role of the user
 *                     example: admin
 *       500:
 *         description: Internal server error
 */
router.get('/', getAllUsers)

/**
 * @swagger
 * /api/users/profile/{email}:
 *   get:
 *     summary: Get user information by email
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *           format: email
 *         description: Email address of the user
 *         example: johndoe@example.com
 *     responses:
 *       200:
 *         description: User information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: User ID
 *                   example: 1
 *                 username:
 *                   type: string
 *                   description: Username of the user
 *                   example: johndoe
 *                 email:
 *                   type: string
 *                   description: Email address of the user
 *                   example: johndoe@example.com
 *                 role:
 *                   type: string
 *                   description: Role of the user
 *                   example: admin
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: User not found
 *       500:
 *         description: Internal server error
 */
router.get('/profile/:email', getUserByEmail)
router.get('/licenseInfo/:email', getLicenseByEmail)

router.post('/updateProfile/', updateProfileByEmail)

export default router