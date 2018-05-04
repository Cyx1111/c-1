using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Security.AccessControl;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace 影院售票系统
{
    public partial class Form1 : Form
    {
        public Form1()
        {
            InitializeComponent();
        }

        private Cinema cinema = new Cinema();
        private Schedule schedule = new Schedule(); //放映计划类 解析xml和保存数据的泛型集合

        private void Form1_Load(object sender, EventArgs e)
        {
            schedule.LoadItems(); //xml解析的方法
            Info(); //解析以后再treeview上显示的方法
            show();
            SUAN();


        }


        private void Info() //在treeview上显示
        {
            string movieName = string.Empty;
            TreeNode node = null;
            foreach (Scheduleltem item in  schedule.Items.Values)
            {
                if (item.Movie.MovieName != movieName)
                {
                    //一个item代表 一个场次
                    node = new TreeNode(item.Movie.MovieName);
                    treeView1.Nodes.Add(node);
                }

                TreeNode tn = new TreeNode(item.Time);
                node.Nodes.Add(tn);
                movieName = item.Movie.MovieName;
            }
        }


        private string Key = string.Empty;

        private void treeView1_AfterSelect(object sender, TreeViewEventArgs e) //电影详情信息
        {
            TreeNode node = treeView1.SelectedNode;
            if (node == null) return;
            if (node.Level != 1) return;
            Key = node.Text;
            this.label2.Text = schedule.Items[Key].Movie.MovieName; //电影名字
            this.label9.Text = schedule.Items[Key].Movie.Director; //导演
            this.label10.Text = schedule.Items[Key].Movie.Actor; //演员
            this.label11.Text = schedule.Items[Key].Movie.MovieType.ToString(); //类型 
            this.label12.Text = schedule.Items[Key].Time; //时间
            this.label13.Text = schedule.Items[Key].Movie.Price.ToString(); //原票价
            this.label14.Text = ""; //优惠
            this.pictureBox1.Image = Image.FromFile(schedule.Items[Key].Movie.Poster);



        }


        public void show()
        {
            for (int i = 0; i < 5; i++)
            {
                for (int j = 0; j < 7; j++)
                {
                    Label lb = new Label();
                    lb.BackColor = Color.Yellow;
                    lb.Location = new Point(20 + j*100, 50 + i*70);
                    lb.Font = new Font("Courier New", 11);
                    lb.Name = (i + 1) + "-" + (j + 1);
                    lb.Size = new Size(80, 30);
                    lb.TabIndex = 0;
                    lb.Text = (i + 1) + "-" + (j + 1);
                    lb.TextAlign = ContentAlignment.MiddleCenter;
                    lb.Click += lb_Click;
                    tabPage3.Controls.Add(lb);
                }
            }
        }

        private void lb_Click(object sender, EventArgs e)
        {

            Label lbl = sender as Label;
            lbl.BackColor = Color.Red;

        }

        private void radioButton1_CheckedChanged(object sender, EventArgs e)
        {
           
          
        }

        private void radioButton2_CheckedChanged(object sender, EventArgs e)
        {
            this.textBox2.Enabled= true;
            this.comboBox1.Enabled = false;
            this.comboBox1.Text = "";
            this.label14.Text = "0";


        }

        private void radioButton3_CheckedChanged(object sender, EventArgs e)
        {
            this.textBox2.Enabled = false;
            this.textBox2.Text = "";
            this.comboBox1.Enabled = true;
            this.comboBox1.Text = "7";
           
        }

        public void SUAN()
        {
            if (this.label14.Text != "")
            {
                int price = int.Parse(this.label13.Text);
                int discount = int.Parse(this.comboBox1.Text);
                this.label14.Text = (price * discount / 10).ToString();
                MessageBox.Show((price * discount / 10).ToString());
            }
        }
    }
}



        

       


