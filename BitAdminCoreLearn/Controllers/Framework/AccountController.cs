/***********************
 * BitAdmin2.0框架文件
 * 登录权限公共功能
 ***********************/
using System;
using System.Linq;
using System.Collections.Generic;
using System.Data;
using Microsoft.AspNetCore.Mvc;
using BitAdminCore.Helpers;
using System.Net;
using System.Text.RegularExpressions;
using Newtonsoft.Json;
using System.IO;
using BitAdminCoreLearn.Models;
using System.Drawing;
using System.Drawing.Imaging;
using BitAdminCoreLearn;

namespace BitAdminCore.Controllers
{
    public class AccountController : Controller
    {
        DataContext dbContext = new DataContext();
        public ActionResult Index()
        {
            return Redirect("/pages/account/login.html");
        }
        [HttpGet]
        public JsonResult IsLogin()
        {
            return Json(Convert.ToString(SSOClient.IsLogin).ToLower());
        }
        public ActionResult VerifyCode()
        {
            try
            {
                string code = VerificationCode.CreateCode(4);
                Bitmap image = VerificationCode.CreateImage(code);
                MemoryStream ms = new MemoryStream();
                image.Save(ms, ImageFormat.Png);
                byte[] bytes = ms.GetBuffer();
                ms.Close();

                HttpContextCore.Current.Session.Set("VerificationCode", code);
                return File(bytes, "image/jpeg");
            }
            catch (Exception ex)
            {
                LogHelper.SaveLog(ex);
                return Json(new { Code = 1, Msg = "服务器异常，请联系管理员！" });
            }
        }

        public JsonResult Login(string account, string password,string verifyCode)
        {
            try
            {
                string vcode = HttpContextCore.Current.Session.Get<string>("VerificationCode");
                if (Convert.ToString(verifyCode).ToLower() != Convert.ToString(vcode).ToLower())
                    return Json(new { Code = 1, Msg = "验证码不正确，请重新输入！" });

                if (!SSOClient.Validate(account, password, out Guid userId))
                    return Json(new { Code = 1, Msg = "帐号或密码不正确，请重新输入！" });

                HttpContextCore.Current.Session.Set("VerificationCode", string.Empty);

                SSOClient.SignIn(userId);
                return Json(new { Code = 0 });
            }
            catch (Exception ex)
            {
                LogHelper.SaveLog(ex);
                return Json(new { Code = 1, Msg = "服务器异常，请联系管理员！" });
            }
        }
      

        [BitAuthorize]
        public JsonResult GetUser()
        {
            try
            {
                SysUser user = SSOClient.User;
                //SysDepartment department = SSOClient.Department;
                return Json(new
                {
                    userCode = Convert.ToString(user.UserCode),
                    userName = Convert.ToString(user.UserName),
                    idCard = Convert.ToString(user.IdCard),
                    mobile = Convert.ToString(user.Mobile),
                    email = Convert.ToString(user.Email),
                    //departmentName = Convert.ToString(department.DepartmentName)
                });
            }
            catch (Exception ex)
            {
                LogHelper.SaveLog(ex);
                return Json(new { Code = 1, Msg = "服务器异常，请联系管理员！" });
            }
        }

        /// <summary>
        /// 登录出
        /// </summary>
        /// <returns></returns>
        public ActionResult SignOut()
        {
            SSOClient.SignOut();
            return Json(new { Code = 0 });
        }         
    }
}