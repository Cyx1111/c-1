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
    public partial class Frmshow : Form
    {
        public se[] ss;
        public Frmshow()
        {
            InitializeComponent(); 
            this.intt();

        }

        private void Frmshow_Load(object sender, EventArgs e)
        {
            this.update();
        }
        public void intt() {
            ss = new se[3];
            se se1 = new se();
            se1.Id = 1;
            se1.Name = "小红";
            se1.Age = 33;
            se1.Ping = "未评价";
            se1.Fen = 66;
            ss[0] = se1;

         
            se se2 = new se();
            se2.Id = 2;
            se2.Name = "小小红";
            se2.Age = 12;
            se2.Ping = "未评价";
            se2.Fen = 66;
            ss[1] = se2;

        }
        public void update() 
        {
            for (int i = 0; i < ss.Length; i++) 
            {
                if (ss[i] != null)
                {

                    ListViewItem item = new ListViewItem(ss[i].Id.ToString());

                    item.SubItems.Add(ss[i].Name.ToString());
                    item.SubItems.Add(ss[i].Age.ToString());
                    item.SubItems.Add(ss[i].Ping.ToString());
                    item.SubItems.Add(ss[i].Fen.ToString());

                    listView1.Items.Add(item);

                } 

            }
        
        
        
        }

        private void listView1_SelectedIndexChanged(object sender, EventArgs e)
        {
            
        }

        private void listView1_DoubleClick(object sender, EventArgs e)
        {

            ListViewItem selectItem=listView1.SelectedItems[0];

            Frmjudge g = new Frmjudge();//对选中的评分
            g.selectItem = selectItem;
            g.Show();
        }

         
                        }
        }
    

