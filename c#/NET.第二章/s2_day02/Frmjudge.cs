using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace s2_day02
{
    public partial class Frmjudge : Form
    {
        public Frmjudge()
        {
            InitializeComponent();
        }
        public ListViewItem selectItem = null;
        private void Frmjudge_Load(object sender, EventArgs e)
        {
            textBox1.Text = selectItem.SubItems[1].Text;

        }

        private void button1_Click(object sender, EventArgs e)
        {
            selectItem.SubItems[3].Text = richTextBox1.Text;
            selectItem.SubItems[4].Text = textBox2.Text;
            this.Close();
        }
    }
}
