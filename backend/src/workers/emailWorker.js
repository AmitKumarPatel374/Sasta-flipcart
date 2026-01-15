import "dotenv/config"
import { Worker } from "bullmq"
import connection from "../config/bullmq-connection.js"
import { sendVerifyEmailOtp } from "../services/sendMail/sendVerifyEmailOtp.js"

new Worker(
  "email-queue",
  async (job) => {
    if (job.name === "verify-email") {
      await sendVerifyEmailOtp(job.data)
    }else {
      console.warn("⚠️ Unknown job type:", job.name)
    }
  },
  { connection, concurrency: 3 }
)

console.log("📨 Resume-Builder Email Worker running")
