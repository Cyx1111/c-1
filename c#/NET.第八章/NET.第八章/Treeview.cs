using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace NET.第八章
{
    public partial class Treeview : Form
    {
        public Treeview()
        {
            InitializeComponent();
        }

        private void button1_Click(object sender, EventArgs e)
        {
            //获取文本框的值
            string nodename = textBox1.Text;
            //创建一个节点对象
            TreeNode tn=new TreeNode();
            tn.Text = nodename;
            //添加节点为treeview的根节点
            this.treeView1.Nodes.Add(tn);

        }

        private void button2_Click(object sender, EventArgs e)
        {
            string nodename = textBox1.Text;
            TreeNode tn = new TreeNode();
            tn.Text = nodename;
            TreeNode selectedNode = treeView1.SelectedNode;
            foreach (TreeNode item in selectedNode.Nodes)
            {
                if (item.Text==nodename)
                {
                    MessageBox.Show("换");
                    return;
                }
            }
            treeView1.SelectedNode.Nodes.Add(tn);
        }
    }
}
