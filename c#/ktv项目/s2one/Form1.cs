using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace s2one
{
    public partial class FrmLogin : Form
    {
        public FrmLogin()
        {
            InitializeComponent();
        }
        //储存登录用户信息的对象数组
        public static loginlnfo[] array;
        public string username;//定义
        public string pwd;
        private void button1_Click(object sender, EventArgs e)
        {
            if (textBox1.Text.Trim() == "" || textBox2.Text.Trim() == "")
            {
                MessageBox.Show("用户名或密码不能为空", "提示");
            }
            else
            {//在不是空那个的情况下，回去值，并传到主界面
                string username = textBox1.Text;
                string pwd = textBox2.Text;
                bool isok = false;
                foreach (loginlnfo item in array)
                {
                    if (item != null)
                    {
                        if (item.Email == username && item.Password == pwd)
                        {
                            label5.Visible = false;
                            isok = true;
                            frmmain f = new frmmain();
                            f.label1.Text = "欢迎," + item.Name;
                            f.Show();
                            break;
                        }
                    }
                }
                if(isok==false)
                {
                    //label5.Visible = true;
                    MessageBox.Show("请注册");
                    textBox1.Text = "";
                    textBox2.Text = "";
                    //textBox2.Text = "";
                }
            }
        }

        private void FrmLogin_Load(object sender, EventArgs e)
        {
            //初始化用户信息
            array = new loginlnfo[10];
            loginlnfo info1 = new loginlnfo();
            info1.Name = "小心心";
            info1.Id = "1314741";
            info1.Email = "1615069012@qq.com";
            info1.Password = "xixi";
            array[0] = info1;
            label5.Visible = false;

         
        }

        private void label4_Click(object sender, EventArgs e)
        {
            Frmregist fr = new Frmregist();
            //fr.fl = this;
            fr.Show();
            this.Hide();
        }

        private void label5_Click(object sender, EventArgs e)
        {

        }
    }
}
