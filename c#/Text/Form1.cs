using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace Text
{
    public partial class Form1 : Form
    {
        public Form1()
        {
            InitializeComponent();
        }
        #region 点击取消

        private void btnClose_Click(object sender, EventArgs e)
        {
            DialogResult result = MessageBox.Show("是否退出？","操作提示",MessageBoxButtons.YesNo);
            if (result ==DialogResult.Yes)
            {
                Application.Exit();
            }
        } 
        #endregion

        #region 点击保存
        private void btnOk_Click(object sender, EventArgs e)
        {
            FileStream myfs = new FileStream("D:\\" + tboAddress.Text + ".txt", FileMode.Append);
            StreamWriter mysw = new StreamWriter(myfs);
            mysw.Write(lblDay.Text + tboDay.Text + "    " + lblAddress.Text + tboAddress.Text + "    " + lblListend.Text + rtbListend.Text + "\n");
            mysw.Close();
            myfs.Close();
            MessageBox.Show("添加成功！", "提示", MessageBoxButtons.OK);
        } 
        #endregion
    }
}
