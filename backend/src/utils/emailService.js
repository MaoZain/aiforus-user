import nodemailer from 'nodemailer'

// 创建邮件传输器
const createTransporter = () => {
  // 验证必要的环境变量
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    throw new Error('SMTP credentials not configured. Please set SMTP_USER and SMTP_PASS in environment variables.')
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT) || 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    // 添加调试选项
    debug: process.env.NODE_ENV === 'development',
    logger: process.env.NODE_ENV === 'development'
  })
}

// 测试邮件连接
export const testEmailConnection = async () => {
  try {
    const transporter = createTransporter()
    await transporter.verify()
    console.log('Email connection verified successfully')
    return true
  } catch (error) {
    console.error('Email connection test failed:', error.message)
    return false
  }
}

export const sendVerificationEmail = async (email, username, verificationUrl) => {
  try {
    // 首先测试连接
    const transporter = createTransporter()
    
    console.log('Testing email connection...')
    await transporter.verify()
    console.log('Email connection verified')
    
    const mailOptions = {
      from: `"${process.env.APP_NAME || 'Your App'}" <${process.env.SMTP_USER}>`,
      to: email,
      subject: '请验证您的邮箱地址',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>欢迎注册 ${process.env.APP_NAME || 'Your App'}!</h2>
          <p>亲爱的 ${username}，</p>
          <p>感谢您注册我们的服务。请点击下面的链接来验证您的邮箱地址：</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" 
               style="background-color: #007bff; color: white; padding: 12px 30px; 
                      text-decoration: none; border-radius: 5px; display: inline-block;">
              验证邮箱
            </a>
          </div>
          <p>或者复制以下链接到浏览器中打开：</p>
          <p style="word-break: break-all; color: #666;">${verificationUrl}</p>
          <p><strong>注意：此链接将在1小时后过期。</strong></p>
          <p>如果您没有注册我们的服务，请忽略此邮件。</p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          <p style="color: #666; font-size: 12px;">
            此邮件由系统自动发送，请勿回复。
          </p>
        </div>
      `,
    }
    
    console.log('Sending verification email to:', email)
    const result = await transporter.sendMail(mailOptions)
    console.log('Verification email sent successfully:', result.messageId)
    
    return result
  } catch (error) {
    console.error('Error sending verification email:', {
      message: error.message,
      code: error.code,
      command: error.command,
      response: error.response,
      responseCode: error.responseCode
    })
    
    // 根据错误类型提供更具体的错误信息
    if (error.code === 'EAUTH') {
      throw new Error('邮件认证失败，请检查SMTP用户名和密码')
    } else if (error.code === 'ECONNECTION') {
      throw new Error('无法连接到邮件服务器，请检查网络连接和SMTP配置')
    } else if (error.code === 'ETIMEDOUT') {
      throw new Error('邮件发送超时，请稍后重试')
    } else {
      throw new Error(`邮件发送失败: ${error.message}`)
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