using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Windows.Forms;

using SuperMarket;

namespace SuperMarket
{
    public partial class FrmSuperMarketMain : Form
    {
        public User user; // 当前登录的用户信息

        public FrmSuperMarketMain()
        {
            InitializeComponent();
        }

        /// <summary>
        /// 修改密码
        /// </summary>
        private void tsmiChangePassWord_Click(object sender, EventArgs e)
        {
            FrmChangePwd frm = new FrmChangePwd();
            frm.user = this.user;
            frm.ShowDialog();           
        }

        /// <summary>
        /// 退出应用程序
        /// </summary>
        private void tsmiExit_Click(object sender, EventArgs e)
        {
            if (MessageBox.Show("确定退出吗？", "提示", MessageBoxButtons.YesNo, MessageBoxIcon.Question) == DialogResult.Yes)
            {
                Application.Exit();
            }            
        }

        /// <summary>
        /// 跳转到商品管理
        /// </summary>
        private void picCommodity_Click(object sender, EventArgs e)
        {
            FrmSuperMarket frm = new FrmSuperMarket();
            frm.ShowDialog();
        }
       
        /// <summary>
        /// 跳转到商品类别管理
        /// </summary>
        private void picCommoditySort_Click(object sender, EventArgs e)
        {
            FrmSuperMarketSort frm = new FrmSuperMarketSort();
            frm.ShowDialog();
        }

        /// <summary>
        /// 打开关于窗体
        /// </summary>
        private void tsmiHelp_Click(object sender, EventArgs e)
        {
            FrmAbout about = new FrmAbout();
            about.ShowDialog();
        }

        /// <summary>
        /// 窗体关闭时，退出应用程序
        /// </summary>       
        private void FrmSuperMarketMain_FormClosed(object sender, FormClosedEventArgs e)
        {
            Application.Exit(); 
        }
    }
}
