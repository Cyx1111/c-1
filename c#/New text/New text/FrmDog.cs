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
    public partial class FrmDog : Form
    {
        public FrmDog()
        {
            InitializeComponent();
        }

        private void FrmDog_Load(object sender, EventArgs e)
        {

        }

        private void btnsmall_Click(object sender, EventArgs e)
        {
            this.listView1.View = View.SmallIcon;
        }

        private void btnlarge_Click(object sender, EventArgs e)
        {
            this.listView1.View = View.LargeIcon;
        }

        private void 大图标ToolStripMenuItem_Click(object sender, EventArgs e)
        {
            this.listView1.View = View.LargeIcon;//小图标 view是转换的属性

        }

        private void 小图标ToolStripMenuItem_Click(object sender, EventArgs e)
        {
            this.listView1.View = View.SmallIcon;//大图标
        }

        private void 详细信息ToolStripMenuItem_Click(object sender, EventArgs e)
        {
            this.listView1.View = View.Details;//各项之间的转换
        }
    }
}
