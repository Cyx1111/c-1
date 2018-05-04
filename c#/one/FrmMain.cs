using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using System.IO;

namespace Travellog
{
    public partial class FrmMain : Form
    {
        public FrmMain()
        {
            InitializeComponent();
        }

        private void FrmMain_Load(object sender, EventArgs e)
        {
           
        }

        private void bttSave_Click(object sender, EventArgs e)
        {
            try
            {
                FileStream fs = new FileStream("E:\\" + textPlace.Text + ".txt", FileMode.Create);
                StreamWriter sw = new StreamWriter(fs);
                sw.Write("时间：" + textTime.Text + "\t地点：" +textPlace.Text+ "\t见闻:" + rtbStories.Text);
                sw.Close();
                fs.Close();
                DialogResult result = MessageBox.Show("是否退出？", "操作提示", MessageBoxButtons.YesNo);
                if (result == DialogResult.Yes)
                {
                    Application.Exit();
                }

            }
            catch (Exception ex)
            {

                MessageBox.Show("提示"+ex);
            }
          

        }
    }
}
