using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace s2_003
{
    public partial class frmci : Form
    {
        //保存父窗体的引用
        public Frmmian frmparent { get; set; }
        public frmci()
        {
            InitializeComponent();
            this.txtsex.SelectedIndex = 0;
        }

        private void textBox1_TextChanged(object sender, EventArgs e)
        {

        }

        private void gbtext_Enter(object sender, EventArgs e)
        {

        }

        private void frmci_Load(object sender, EventArgs e)
        {

        }

        private void button1_Click(object sender, EventArgs e)
        {
            try
            {
                se pr = new se();
                pr.Id = Convert.ToInt32(this.txtid.Text.Trim());
                pr.Age = Int32.Parse(this.txtage.Text.Trim());
                pr.Name = this.txtname.Text.Trim();
                if (this.txtsex.SelectedItem.ToString() == "男")
                {
                    pr.sex = "男";
                }
                else
                {
                    pr.sex = "女";
                }
                foreach (se item in frmparent.ss)
                {
                    if (item.Id == pr.Id)
                    {
                        MessageBox.Show("此工号已存在");
                        return;
                    }
                }
                frmparent.ss.Add(pr);
                this.Close();
            }
            catch (Exception ex)
            {
                MessageBox.Show("出错！" + ex.Message);
            }
            finally 
            {
                this.frmparent.bindgrid(frmparent.ss);            
            
            }
        }
    }
}
