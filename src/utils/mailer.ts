import nodemailer from 'nodemailer'
import { Env } from '../common/schema/app.schema'

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: Env.MAIL_USER,
        pass: Env.MAIL_PASSWORD
    }
})

export default transporter

