using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace three
{
    public partial class frmMain : Form
    {
        public frmMain()
        {
            InitializeComponent();
        }

        private void treeView1_AfterSelect(object sender, TreeViewEventArgs e)
        {
            
        }

        private void frmMain_Load(object sender, EventArgs e)
        {
            TreeNode node = new TreeNode("石牌街道");
            this.treeView1.Nodes.Add(node);
            

        }

        public void info()
        {
            TreeNode node=new TreeNode();

        }
    }
}
