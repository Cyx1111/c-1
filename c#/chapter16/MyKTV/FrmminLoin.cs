using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace MyKTV
{
    public partial class FrmminLoin : Form
    {
        public FrmminLoin()
        {
            InitializeComponent();
        }
        /// <summary>
        /// 新增歌手信息
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void 新增歌手信息ToolStripMenuItem_Click(object sender, EventArgs e)
        {
            //打开添加信息的窗口
            FrmAdd fm = new FrmAdd();
            fm.MdiParent = this;
            fm.Show();
        }

        private void FrmminLoin_Load(object sender, EventArgs e)
        {

        }

        private void 修改歌手信息ToolStripMenuItem_Click(object sender, EventArgs e)
        {
            Frmamend fm = new Frmamend();
            fm.MdiParent = this;
            fm.Show();

        }

        private void 退出ToolStripMenuItem_Click(object sender, EventArgs e)
        {
            Application.Exit();
        }

        private void 新增歌曲ToolStripMenuItem_Click(object sender, EventArgs e)
        {
            FrmMusic fm = new FrmMusic();
            fm.MdiParent = this;
            fm.Show();
        }

        private void 查询歌曲信息ToolStripMenuItem_Click(object sender, EventArgs e)
        {
            FrmSong fm = new FrmSong();
            fm.MdiParent = this;
            fm.Show();
        }

        private void 歌手照片路径ToolStripMenuItem_Click(object sender, EventArgs e)
        {
            Frmsingerurl fm = new Frmsingerurl();
            fm.MdiParent = this;
            fm.Show();
        }

        private void 歌曲路径ToolStripMenuItem_Click(object sender, EventArgs e)
        {
            FrmSongurl fm = new FrmSongurl();
            fm.MdiParent = this;
            fm.Show();
        }

        private void 账户管理ToolStripMenuItem_Click(object sender, EventArgs e)
        {
            Frmg_ fm = new Frmg_();
            fm.MdiParent = this;
            fm.Show();
        }
    }
}
