using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Data.SqlClient;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace MyKTV
{
    public partial class FrmAdd : Form
    {


        public string urls = "what.png";
        //根据名字的有无增删改
        public string name;
        public FrmAdd()
        {
            InitializeComponent();
        }
        /// <summary>
        /// 新增歌手的主窗体
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void FrmAdd_Load(object sender, EventArgs e)
        {
                     lei();
                     info();
        }

        //控件上显示信息
        public void info()
        {

            try
            {
                StringBuilder sb = new StringBuilder();
                //拼接sql语句
                sb.AppendFormat("select * from singer_info where singer_name = '{0}'", this.name);
                SqlCommand cmd = new SqlCommand(sb.ToString(), db.Connection);
                db.OpenConnection();
                SqlDataReader rade = cmd.ExecuteReader();
                if (rade.Read())
                {
                    this.txtName.Text = rade["singer_name"].ToString();
                    string sex = rade["singer_Sex"].ToString();
                    //判断按钮
                    if (sex.Trim().Equals("男"))
                    {
                        this.rbtmen.Checked = true;
                    }
                    else if (sex.Trim().Equals("女"))
                    {
                        this.rbtwmen.Checked = true;
                    }
                    else
                    {
                        this.rbtgrup.Checked = true;
                    }
                    this.cmbmold.SelectedValue = rade["singertype_id"];
                    //urls读出来
                    urls = rade["singer_phone_url"].ToString();
                    //如果urls不为空
                    if (!urls.Equals(string.Empty))
                    {
                        //地址
                        urls = KTVUtil.singerPhotoPath + "\\" + rade["singer_phone_url"].ToString();
                    }
                    else
                    {
                        urls = ("what.png");

                     
                    }
                    //赋值到pictureBox1
                    pictureBox1.Image = Image.FromFile(urls);
                    textBox1.Text = rade["singer_del"].ToString();
                }
            }
            catch (Exception ex)
            {

                MessageBox.Show(ex.Message);
            }
            finally
            {
                db.CloseConnection();
            }

        }
        //提示语句
        public bool CheckInfo()
        {
            if (this.txtName.Text.Equals(string.Empty))
            {
                MessageBox.Show("请输入歌手！");
                return false;
            }
            return true;
        }
        /// <summary>
        /// 新增
        /// </summary>
        public void Add()
        {
            //创建DBHelper 的对象
            DBHelper sb = new DBHelper();
            string name = this.txtName.Text;//第一个文本框
            int id = Convert.ToInt32(this.cmbmold.SelectedValue);
            string sex;//性别
            if (this.rbtmen.Checked)
            { sex = "男"; }
            else if (this.rbtwmen.Checked)
            { sex = "女"; }
            else
            { sex = "组合"; }
            string del = this.textBox1.Text;
            int count = name.Length;//有几个字的查询
            //拼接sql语句
            string sql = string.Format("insert into singer_info(singer_name,singertype_id,singer_Sex,singer_phone_url,singer_del) values('{0}',{1},'{2}','{3}','{4}')", name, id, sex, urls, del);
            SqlCommand com = new SqlCommand(sql, sb.Connection);
            try
            {
                //insert into 表明（列名） values（值1，2，）
               // ExtcuteReader
                //
                //update 表名 set 列名
                //.ExecuteNonQuery();
                //select 列名 from 表明
                //dalete from 表明 where 列名

               sb.OpenConnection();
                int chose = com.ExecuteNonQuery();
                if (chose > 0)
                {
                    MessageBox.Show("添加成功！");
                }
                else
                {
                    MessageBox.Show("添加失败！");
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.ToString());
            }
            finally
            {
               sb.CloseConnection();
            }
        }

        /// <summary>
        /// 歌手类型
        /// </summary>
        public void lei()
        {
            DBHelper db = new DBHelper();
            try
            {
                string sql = "select * from singer_type";
                SqlDataAdapter da = new SqlDataAdapter(sql,db.Connection);
                DataSet ds = new DataSet();

                if (ds.Tables["singer_type"] != null)
                {
                    ds.Tables["singer_type"].Clear();
                }
                //填充数据
                da.Fill(ds);
                DataRow row = ds.Tables[0].NewRow();
                row["singertype_id"] = -1;
                row["singertype_name"] = "请选择";
               ds.Tables[0].Rows.InsertAt(row,0);
               cmbmold.DisplayMember = "singertype_name";
               cmbmold.ValueMember = "singertype_id";
                //填充数据
               cmbmold.DataSource = ds.Tables[0];
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message);
               
            }
        }
        DBHelper db = new DBHelper();
        //修改
        private void Updade()
        {
            string name = this.txtName.Text;
            int id = (int)this.cmbmold.SelectedValue;
            string sex;
            if (this.rbtmen.Checked)
            { sex = "男"; }
            else if (this.rbtwmen.Checked)
            { sex = "女"; }
            else
            { sex = "组合"; }
            string phone_url = urls;
            string del = this.textBox1.Text;
            string sql = string.Format("update singer_info set singertype_id={1},singer_Sex='{2}',singer_phone_url='{3}',singer_del='{4}' where singer_name='{0}'", name, id, sex, phone_url, del);
            SqlCommand com = new SqlCommand(sql,db.Connection);
            try
            {
                db.OpenConnection();
                int chose = com.ExecuteNonQuery();
                if (chose > 0)
                {
                    MessageBox.Show("修改成功！");
                }
                else
                {
                    MessageBox.Show("修改失败！");
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.ToString());
            }
            finally
            {
                db.OpenConnection();
            }
        }
        /// <summary>
        /// 添加的窗口
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void btnADD_Click(object sender, EventArgs e)
        {
            Button bt = new Button(); 
            if (CheckInfo())
            {
                if (name == null)
                {
                    btnADD.Show();
                   btnADD.Text ="添加";
                    Add();
                }
                else
                {
                    this.btnADD.Text = "修改";
                    Updade();
                }
            }
        }
        /// <summary>
        /// 退出的窗口
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void btnesc_Click(object sender, EventArgs e)
        {

            this.Close();
        }
        /// <summary>
        /// 浏览按钮
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void btnbrowse_Click(object sender, EventArgs e)
        {
        
            //获取要选择的内容
            //Filter属性：用来获取或设置当前文件名筛选器字符串，
            //该字符串决定对话框的【另存为文件类型】或【文件类型】框中出现的选择内容。
            //对于每个筛选选项，筛选器字符串都包含筛选器说明、垂直线条（|）和筛选器模式。不同筛选选项的字符串由垂直线条隔开
            //，例如： “文本文件(*.txt)|*.txt|所有文件(*.*)|*.*” 。还可以通过用分号来分隔各种文件类型，可以将多个筛选器模式添加到筛选器中，
            //例如： “图像文件(*.BMP;*.JPG;*.GIF)|*.BMP;*.JPG; *.GIF|所有文件(*.*)|*.*” 。
           //打开文件夹
            OpenFileDialog open = new OpenFileDialog();
            //打开初始目录
            open.InitialDirectory = Application.StartupPath;
            //判定格式
            open.Filter = "All files (*.*)|*.*|txt files (*.txt)|*.txt";
            if (open.ShowDialog() == DialogResult.OK)
            {
                string url = open.FileName.ToString();
                this.pictureBox1.Image = Image.FromFile(url);
                //获取地址的后缀文字
                urls = url.Substring(url.LastIndexOf('\\') + 1);
            }
        }
    }
}
