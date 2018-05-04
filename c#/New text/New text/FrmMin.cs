using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace New_text
{
    public partial class FrmMin : Form
    {
        public FrmMin()
        {
            InitializeComponent();
        }

        private void FrmMin_Load(object sender, EventArgs e)
        {
            

        }

        private void 文件ToolStripMenuItem_Click(object sender, EventArgs e)
        {
            DialogResult daa = MessageBox.Show("确定添加么？", "提示", MessageBoxButtons.OKCancel);
            if (daa == DialogResult.Cancel)
            {
                this.Close();
            }
            

        }

        private void 编辑ToolStripMenuItem_Click(object sender, EventArgs e)
        {

        }

        private void 视图ToolStripMenuItem_Click(object sender, EventArgs e)
        {

        }

        private void 打开ToolStripMenuItem_Click(object sender, EventArgs e)
        {
            FrmFormation frm = new FrmFormation();
            frm.Show();
        }

        private void 新建ToolStripMenuItem_Click(object sender, EventArgs e)
        {
            this.IsMdiContainer = true;
            FrmDog frm = new FrmDog();
            frm.MdiParent = this;
            frm.Show();

        }
    }
}
