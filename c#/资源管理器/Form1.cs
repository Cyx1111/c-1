using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace 资源管理器
{
    public partial class Form1 : Form
    {
         

        public Form1()
        {
            InitializeComponent();

        }
        private void Form1_Load(object sender, EventArgs e)
        {
            //加载启动器
            LoadRootNode();
        }

        private void LoadRootNode() //加载启动器
        {
            //(一)获得驱动，把名字循环加入
            //DriveInfo[] drivers = DriveInfo.GetDrives(); //获得整个系统磁盘驱动

            ////将盘符名加载到TreeView的顶级节点
            //  foreach (DriveInfo driver in drivers)
            // {
            //TreeNode node = new TreeNode(driver.Name);
            //node.Tag = driver.Name;
            //this.tvlist.Nodes.Add(node);




      //（二）new出三个节点，并把它添加到treeview中
            TreeNode tn = new TreeNode();
            tn.Text = "C:\\";
            tn.Tag = "C:\\";
            this.treeView1.Nodes.Add(tn);

            TreeNode tn1= new TreeNode();
            tn1.Text = "F:\\";
            tn1.Tag = "F:\\";
            this.treeView1.Nodes.Add(tn1);

         

            TreeNode tn2 = new TreeNode();
            tn2.Text = "E:\\";
            tn2.Tag = "E:\\";
            this.treeView1.Nodes.Add(tn2);
        }
       
       // （一）
        //public void BindInfo(TreeNode node)
         //将目录TreeView中和子目录绑到listView中
        //{
        //    //绑定子目录
        //    DirectoryInfo directoryInfo = new DirectoryInfo(node.Tag.ToString());
        //    //返回当前目录的子目录
        //    DirectoryInfo[] dirc = directoryInfo.GetDirectories();
        //    node.Nodes.Clear();
        //    foreach (DirectoryInfo item in dirc)
        //    {
        //        TreeNode temp = new TreeNode();
        //        temp.Text = item.Name;
        //        temp.Tag = item.FullName;//完整的路径
        //        node.Nodes.Add(temp);
        //    }
        //    //得到当前的子文件
        //    FileInfo[] fi = directoryInfo.GetFiles();
        //    //为了不让它重复出现
        //    listView1.Items.Clear();
        //    //循环到listVilw中
        //    foreach (FileInfo item in fi)
        //    {
        //        ListViewItem list = new ListViewItem();
        //        list.Text = item.Name;//文件名字
        //        list.SubItems.Add((item.Length / 1024.0).ToString());//大小
        //        list.SubItems.Add(item.Extension);//类型
               
        //        list.SubItems.Add(item.FullName);//路径 
        //        listView1.Items.Add(list);
        //    }


        private void BindInfo(TreeNode node)//(二）
        {//绑定子目录，
            DirectoryInfo directoryInfo=new DirectoryInfo(node.Tag.ToString());

            DirectoryInfo[] dirs = directoryInfo.GetDirectories();
            foreach (DirectoryInfo di in dirs)
            {
                TreeNode temp=new TreeNode();
                temp.Text = di.Name;
                temp.Tag = di.FullName;
                node.Nodes.Add(temp);
            }
            FileInfo[] fileInfo = directoryInfo.GetFiles();
            List<MyFile> files = new List<MyFile>();
            foreach (FileInfo myFile in fileInfo)
            {
                MyFile file=new MyFile();
                file.FileName = myFile.Name;
                file.FilePath = myFile.FullName;
                file.FileLength = myFile.Length;
                file.FileType = myFile.Extension;
                files.Add(file);



                 //绑定listView
            ListViewItem item = null;
            this.listView1.Items.Clear();
            foreach (MyFile xixi in files)
            {
                item = new ListViewItem();
                item.Text = xixi.FileName;
                item.SubItems.Add((xixi.FileLength/ 1024.0).ToString());//大小
                item.SubItems.Add(xixi.FileType);
               item.SubItems.Add(xixi.FilePath);
               this.listView1.Items.Add(item);
            }
        }
        }

        private void treeView1_AfterSelect(object sender, TreeViewEventArgs e)
        {
            TreeNode node = treeView1.SelectedNode;
            this.BindInfo(node);
        }

        private void 复制ToolStripMenuItem_Click(object sender, EventArgs e)//复制
        {
            if (this.listView1.SelectedItems.Count==0)
            {
                return;
            }
            //提示用户选择目标文件夹
            FolderBrowserDialog fbd=new FolderBrowserDialog();
            DialogResult result = fbd.ShowDialog();//对话框
            //原文件路径
            string sourcepath = listView1.SelectedItems[0].SubItems[3].Text;
            //目标文件路径
            string despath = null;
            if (result==DialogResult.OK)
            {
                despath = fbd.SelectedPath;
                //listview表示显示文件信息的listview对象
                despath += "\\" + listView1.SelectedItems[0].SubItems[0].Text;
                //复制文件
                File.Copy(sourcepath,despath);
                MessageBox.Show("复制成功！");
            }
        }

        private void 删除ToolStripMenuItem_Click(object sender, EventArgs e)//删除
        {
            if (listView1.SelectedItems.Count > 0)
            {
                DialogResult resuot = MessageBox.Show("确定要删除此文件吗？", "提示", MessageBoxButtons.OKCancel, MessageBoxIcon.Question);
                if (resuot == DialogResult.OK)
                {
                    string path = listView1.SelectedItems[0].SubItems[3].Text;
                    File.Delete(path);
                    //删除lvlist的数据
                    listView1.SelectedItems[0].Remove();
                }
            }
        }

        private void listView1_MouseDoubleClick(object sender, MouseEventArgs e)//鼠标
        {
            //创建打开文件框的对象
            OpenFileDialog open = new OpenFileDialog();
            //获取路径
            string path = listView1.SelectedItems[0].SubItems[3].Text;

            //目的就是想通过指定资源管理器打开指定的地址。expporer:打开资源管理器
            System.Diagnostics.Process.Start("explorer.exe", path);
        }

     

      

    }
}
