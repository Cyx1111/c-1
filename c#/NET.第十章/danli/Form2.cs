using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace danli
{
    public partial class Form2 : Form
    {
        public Form2()
        {
            InitializeComponent();
        }

        private void Form2_Load(object sender, EventArgs e)
        {
            dataGridView1.SelectionMode = DataGridViewSelectionMode.FullRowSelect;
            dataGridView1.ContextMenuStrip = contextMenuStrip1;
            List<Sing> list = new List<Sing>()
            {
                new Sing("病变.mp3","F:\\网易云\\病变.mp3"),
                new Sing("Ryan.B - 再也没有.mp3","F:\\网易云\\Ryan.B - 再也没有.mp3")

            };
            dataGridView1.DataSource = new BindingList<Sing>(list);

        }

        private void 播放ToolStripMenuItem_Click(object sender, EventArgs e)
        {
            Form1 fm=new Form1();
            string path = dataGridView1.SelectedRows[0].Cells[1].Value.ToString();
            fm.path = path;
            fm.Playsong();
            fm.Show();
        }
    }
}
