using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace 网络精灵电视台
{
    public partial class Form1 : Form
    {
        public Form1()
        {
            InitializeComponent();
          
        }
        ChannelManager cm = new ChannelManager();
        private void treeView1_AfterSelect(object sender, TreeViewEventArgs e)
        {
            TreeNode selectedNode = treeView1.SelectedNode;

            int level = selectedNode.Level;
            if (level==1)
            {
                ChannelBase channel =(ChannelBase) selectedNode.Tag;
                channel.Tvlist.Clear();
                channel.Fetch();
                dataGridView1.DataSource = channel.Tvlist;

            }


        }
        
        private void menuStrip1_ItemClicked(object sender, ToolStripItemClickedEventArgs e)
        {

        }
       

        private void Form1_Load(object sender, EventArgs e)
        {
            //去掉多余的列
            this.dataGridView1.AutoGenerateColumns = false;
            TreeNode node = new TreeNode("我的电视台");
            this.treeView1.Nodes.Add(node);
            node = new TreeNode("所有电视台");
            this.treeView1.Nodes.Add(node);
            Info();                
        }

        public void Info()//子节点
        {
           ChannelManager ch=new ChannelManager();
            ch.LoadAllChannel();
          
            foreach (ChannelBase item in ch.dic.Values)
            {
                TreeNode  tn=new TreeNode();
                tn.Text = item.Channelname;
                tn.Tag = item;
                treeView1.Nodes[1].Nodes.Add(tn);
            }
        }

        private void dataGridView1_CellContentClick(object sender, DataGridViewCellEventArgs e)
        {

        }
    }
}
