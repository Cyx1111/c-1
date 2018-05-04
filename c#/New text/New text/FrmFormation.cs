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
    public partial class FrmFormation : Form
    {
        public FrmFormation()
        {
            InitializeComponent();
        }

        private void button1_Click(object sender, EventArgs e)
        {
            ListViewItem liec = new ListViewItem("固始", 0);
            liec.SubItems.Add("河南");
            liec.SubItems.Add("河南");
            liec.SubItems.Add("河南");
            listView1.Items.Add(liec);

            ListViewItem liea = new ListViewItem();
            liea.ImageIndex = 4;
            liea.SubItems.AddRange(new string[] { "被禁", "伤害", "故事" });
            listView1.Items.Add(liea);
        }

        private void FrmFormation_Load(object sender, EventArgs e)
        {
           

        }

        private void listView1_SelectedIndexChanged(object sender, EventArgs e)
        {

        }

        


    }
}
