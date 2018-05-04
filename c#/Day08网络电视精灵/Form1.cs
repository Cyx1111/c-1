using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace Day08网络电视精灵
{
    public partial class Form1 : Form
    {
        public Form1()
        {
            InitializeComponent();
        }
        TreeNode allNode = new TreeNode();
        private void Form1_Load(object sender, EventArgs e)
        {
            
            //1.TV上构建两个节点
            TreeNode myNode = new TreeNode();
            myNode.Text = "我的电视台";
            //将myNode绑定到tvChannel上
            tvChannel.Nodes.Add(myNode);

            
            allNode.Text = "所有电视台";
            tvChannel.Nodes.Add(allNode);

            LoadDataFromXml();
            
        }

        private void LoadDataFromXml()
        {
            //ChannelManager有一个集合 调度 ResolveAllChannels方法 集合就有值了
            ChannelManager manager = new ChannelManager();
            manager.ResolveAllChannels();//相当于给集合赋值了
            foreach (ChannelBase channel in manager.AllChannels.Values)
            {
                //一个channel在Tv上就是一个节点
               
                TreeNode tn = new TreeNode();
                tn.Text = channel.ChannelName;
                tn.Tag = channel;
                allNode.Nodes.Add(tn);
            }
        }

        private void menuTree_ItemClicked(object sender, ToolStripItemClickedEventArgs e)
        {

        }

        private void tvChannel_AfterSelect(object sender, TreeViewEventArgs e)
        {
            TreeNode selectedNode = tvChannel.SelectedNode;


            int level = selectedNode.Level;
            if (level==1)
            {
                ChannelBase channel = (ChannelBase) selectedNode.Tag;

                //channel.ProgramList.Clear();
                channel.Fetch();
                dgvProgList.DataSource = channel.ProgramList;

            }
        }
    }
}
