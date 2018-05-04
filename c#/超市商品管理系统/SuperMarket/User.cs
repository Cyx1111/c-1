using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace SuperMarket
{
    /// <summary>
    /// 代表登录的用户
    /// </summary>
    public class User
    {
        private string passWord;
        /// <summary>
        /// 密码
        /// </summary>
        public string PassWord
        {
            get { return passWord; }
            set { passWord = value; }
        }

        private string userName;
        /// <summary>
        /// 用户名
        /// </summary>
        public string UserName
        {
            get { return userName; }
            set { userName = value; }
        }
    }
}
