export default (CLIENT, firstName, lastName) => `
  <html>
    <body>
      <div style="overflow: hidden;">
        <div style="width: 100%; background-color: #FDFDFD; border-collapse: separate !important; border-spacing: 0">
          <div style="font-size: 16px; padding: 30px; vertical-align: top; display: block; width: 675px; max-width: 675px; margin: 0 auto;">
            <div style="margin-bottom: 30px; margin-top: 15px;">
              <p style="color: #2E323B;">
                <img style="margin-right:15px;" src="https://i.imgur.com/pcu86US.png" height="30px" alt="saplogo.png"></img>
                <img src="https://i.imgur.com/Clo9cbt.png" height="40px" alt="sharkslogo.png"></img>
              </p>
            </div>
            <div style="background-color: #FFFFFF; border: 1px solid #f0f0f0;">
              <div style="font-size: 16px; padding: 30px; vertical-align: top; display: block;">
                <h2 style="margin-bottom: 30px; color: #006d75;">
                  Welcome to the San Jose Sharks Ice Team, ${firstName} ${lastName}!
                </h2>
                <p style="font-size: 16px; margin-bottom: 30px; color: #000000;">
                  Your account is active and ready to go! Please click the button below to login.
                </p>
                <p style="font-size: 16px; margin-bottom: 30px; color: #000000;">
                  Thank you,
                  <br />
                  <span style="font-style: italic;">The San Jose Sharks Ice Team</span>
                </p>
                <div style="margin-bottom: 20px; text-align: center">
                  <a style="font-size: 18px; text-decoration: none; line-height: 40px; width: 200px; color: #FFFFFF; background-color: #006d75; display: inline-block;" href="${CLIENT}/employee/login">Employee Login</a>
                </div>
                <small style="color: #999999; font-size: 11px; text-align: center">
                  Or click on this link:
                  <a style="color: #999999; text-decoration: underline; margin-left: 4px;" href="${CLIENT}/employee/login">${CLIENT}/employee/login</a>
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </body>
  </html>
  `;
