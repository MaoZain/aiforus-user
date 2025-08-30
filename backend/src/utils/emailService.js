import Dm20151123, * as $Dm20151123 from '@alicloud/dm20151123'
import * as $OpenApi from '@alicloud/openapi-client'
import * as $Util from '@alicloud/tea-util'

// 创建阿里云邮件推送客户端
const createDmClient = () => {
  const accessKeyId = process.env.ALIYUN_ACCESS_KEY_ID
  const accessKeySecret = process.env.ALIYUN_ACCESS_KEY_SECRET
  
  if (!accessKeyId || !accessKeySecret) {
    throw new Error('阿里云访问密钥未配置，请设置 ALIYUN_ACCESS_KEY_ID 和 ALIYUN_ACCESS_KEY_SECRET')
  }
  
  const config = new $OpenApi.Config({
    accessKeyId,
    accessKeySecret,
    endpoint: 'dm.us-east-1.aliyuncs.com'
  })
  
  return new Dm20151123.default(config)
}

// 发送单封邮件
const sendSingleMail = async (params) => {
  const client = createDmClient()
  
  try {
    const singleSendMailRequest = new $Dm20151123.SingleSendMailRequest(params)
    const runtime = new $Util.RuntimeOptions({})
    const result = await client.singleSendMailWithOptions(singleSendMailRequest, runtime)
    return result.body
  } catch (error) {
    console.error('邮件SDK调用失败:', error)
    throw error
  }
}

// 测试邮件连接
export const testEmailConnection = async () => {
  try {
    // 测试SDK配置是否正确
    createDmClient()
    console.log('阿里云邮件SDK配置验证成功')
    return true
  } catch (error) {
    console.error('邮件SDK配置验证失败:', error.message)
    return false
  }
}

export const sendVerificationEmail = async (email, username, verificationUrl) => {
  try {
    console.log('使用阿里云邮件推送SDK发送验证邮件到:', email)
    
    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 20px;">
        <h3>Email Verification</h3>
        <p>Hello ${username},</p>
        <p>You are registering an account with ${process.env.APP_NAME || 'AiForus'}. To complete your registration, please verify your email address.</p>
        <p>Please click the following link to verify:</p>
        <p><a href="${verificationUrl}">${verificationUrl}</a></p>
        <p>This link is valid for 1 hour.</p>
        <p>If you did not request this registration, please ignore this email.</p>
        <br>
        <p>Thank you</p>
        <p>${process.env.APP_NAME || 'AiForus'} Team</p>
      </div>
    `
    
    const params = {
      accountName: process.env.ALIYUN_EMAIL_ACCOUNT,
      replyToAddress: false,
      addressType: 1,
      toAddress: email,
      fromAlias: process.env.APP_NAME || 'AiForus',
      subject: 'Email Verification Required',
      htmlBody: htmlBody
    }
    
    const result = await sendSingleMail(params)
    console.log('验证邮件发送成功:', result.envId)
    
    return { messageId: result.envId }
  } catch (error) {
    console.error('验证邮件发送失败:', error.message)
    
    // 根据错误类型提供更具体的错误信息
    if (error.code === 'InvalidAccessKeyId') {
      throw new Error('阿里云访问密钥ID无效')
    } else if (error.code === 'SignatureDoesNotMatch') {
      throw new Error('阿里云签名验证失败，请检查访问密钥')
    } else if (error.message && error.message.includes('AccountName')) {
      throw new Error('发信地址配置错误，请检查ALIYUN_EMAIL_ACCOUNT配置')
    } else {
      throw new Error(`邮件发送失败: ${error.message || error.code}`)
    }
  }
}

// 添加开发环境的邮件模拟功能
export const sendVerificationEmailDev = async (email, username, verificationUrl) => {
  console.log('=== 开发环境模拟邮件发送 ===')
  console.log('收件人:', email)
  console.log('用户名:', username)
  console.log('验证链接:', verificationUrl)
  console.log('================================')
  
  // 在开发环境中，直接返回成功
  return { messageId: 'dev-mode-' + Date.now() }
}