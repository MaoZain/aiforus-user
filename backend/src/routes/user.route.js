import express from 'express'
import { getAllUsers, getUserByEmail,updateProfileByEmail,getLicenseByEmail,updateLicenseCode,verifyEmailToken,resendVerificationEmailToken,generateInviteLink,handleInviteRegistration,getUserPoints} from '../controllers/user.controller.js'

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

/**
 * @swagger
 * /api/users/points/{email}:
 *   get:
 *     summary: Get user points by email
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *           format: email
 *         description: The user's email address
 *         example: johndoe@example.com
 *     responses:
 *       200:
 *         description: User points fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     email:
 *                       type: string
 *                       example: johndoe@example.com
 *                     totalPoints:
 *                       type: integer
 *                       example: 120
 *                     lastUpdated:
 *                       type: string
 *                       format: date-time
 *                       example: 2024-01-15T10:30:00Z
 *                 message:
 *                   type: string
 *                   example: User points fetched successfully
 *       400:
 *         description: Email is required
 *       404:
 *         description: User not found
 *       500:
 *         description: Failed to fetch user points
 */
router.get('/points/:email', getUserPoints)

router.post('/updateProfile/', updateProfileByEmail)

router.post('/updateLicenseCode/', updateLicenseCode)

router.post('/verifyEmailToken/', verifyEmailToken)
router.post('/resendVerificationEmailToken/', resendVerificationEmailToken)

router.post('/generateInviteLink/', generateInviteLink)
router.post('/inviteRegister/', handleInviteRegistration)

export default router