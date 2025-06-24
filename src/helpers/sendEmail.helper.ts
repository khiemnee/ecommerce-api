import { MailService } from "@sendgrid/mail";
import { emailApiKey } from "../secret";

const sgMail = new MailService();

const sendMail = async (data: any) => {
  const html = `
  <h2>✅ Thanh toán thành công!</h2>
  <p>Xin chào ${data.customer_details?.name || "bạn"},</p>
  <p>Cảm ơn bạn đã đặt hàng. Dưới đây là thông tin đơn hàng của bạn:</p>
  <p><strong>Mã đơn hàng (Session ID):</strong> ${data.id}</p>
  <p><strong>Email người mua:</strong> ${data.customer_details?.email}</p>
  <p><strong>Tổng tiền:</strong> ${data.amount_total.toLocaleString()} VND</p>
  <p><strong>Phương thức thanh toán:</strong> ${
    data.payment_method_types?.[0]
  }</p>
  <p><strong>Thời gian:</strong> ${new Date().toLocaleString()}</p>
  <p>Chúng tôi sẽ liên hệ và xử lý đơn hàng trong thời gian sớm nhất.</p>
  <p>Trân trọng,<br>PDK Shop</p>
`;

  sgMail.setApiKey(emailApiKey!);
  const msg = {
    to: data.customer_details?.email,
    from: "khiemdeptrai2911@gmail.com",
    subject: "Shopping bill",
    html,
  };
  await sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent");
    })
    .catch((error) => {
      console.error(error.message);
    });
};

export default sendMail;
