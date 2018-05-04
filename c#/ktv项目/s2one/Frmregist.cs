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
    public partial class Frmregist : Form
    {
        public Frmregist()
        {
            InitializeComponent();
        }

        private void label6_Click(object sender, EventArgs e)
        {

        }

        //public FrmLogin fl;
        private void button1_Click(object sender, EventArgs e)
        {//比较第一次输入和第二次输入
               if (textBox5.Text.Equals(textBox3.Text)&&textBox6.Text.Equals(textBox4.Text))
            {
                   //实例化，分别被赋值
              loginlnfo ms = new loginlnfo();
              ms.Name = textBox1.Text;
              ms.Id = textBox2.Text;
              ms.Password = textBox4.Text;
              ms.Password2 = textBox6.Text;
              ms.Email = textBox3.Text;
              ms.Email2 = textBox5.Text;
              if (Frmregist.AddSong(ms))
             {//如果循环打印有这个数据，就ok
                 MessageBox.Show("注册成功");
             }
             else
             {
                 MessageBox.Show("注册失败");
             }

            }
            else
            {
                MessageBox.Show("与上次内容不符！");
            }
            
        }
        private static bool AddSong(loginlnfo song)//添加用户
        {
            bool Result = false;    //记录用户是否添加成功
            for (int i = 1; i < FrmLogin.array.Length; i++)
            {
                if (FrmLogin.array[i] == null)
                {
                    FrmLogin.array[i] =song;
                    Result = true;
                    break;
                }
            }
            return Result;
        }

        private void Frmregist_Load(object sender, EventArgs e)
        {
        
        }

        private void textBox4_TextChanged(object sender, EventArgs e)
        {

        }

        private void pictureBox1_Click(object sender, EventArgs e)
        {

        }

        private void button2_Click(object sender, EventArgs e)
        {
            this.Close();
        }


        }
    }

