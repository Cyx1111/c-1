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
    public partial class FrmMusic : Form
    {
        public FrmMusic()
        {
            InitializeComponent();
        }
        public string go;
        public string ab;
        public int type;
        public string look;
        public string name;//查询的按钮
        public string names;//根据歌名赋值到文本框
        public int id;//歌手的id号
        DBHelper db = new DBHelper();
        //条件判断
        public bool What()
        {
            if (textBox1.Text.Trim().Equals(string.Empty))
            {
                MessageBox.Show("请输入歌曲名称");
                return false;
            }
            else if (textBox2.Text.Trim().Equals(string.Empty))
            {
                MessageBox.Show("请输入歌曲拼音缩写");
                return false;
            }
            else if (textBox3.Text.Trim().Equals(string.Empty))
            {
                MessageBox.Show("请输入歌曲歌手");
                return false;
            }
            else
            {
                return true;
            }
        }
        //查歌手的名字
        public void chaxun()
        {
            string sql = "select singer_id from singer_info where singer_name = '" + this.textBox3.Text + "'";
            SqlCommand cmd = new SqlCommand(sql,db.Connection);
            try
            {
                db.OpenConnection();
                SqlDataReader rade = cmd.ExecuteReader();
                if (rade.Read())
                {
                    id = Convert.ToInt32(rade["singer_id"]);
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
        //歌曲类型
        public void infotype()
        { 
                //拼接sql语句
            string sql = "select * from song_type";
            SqlDataAdapter sa = new SqlDataAdapter(sql,db.Connection);
            DataSet ds = new DataSet();
            sa.Fill(ds);
            DataRow row = ds.Tables[0].NewRow();
            row["songtype_id"] = -1;
            row["songtype_name"] = "请选择";
            ds.Tables[0].Rows.InsertAt(row,0);
            comboBox1.DisplayMember = "songtype_name";
            comboBox1.ValueMember = "songtype_id";
            comboBox1.DataSource = ds.Tables[0];
        }
        //添加
        public void Addmusic()
        {
            string name = this.textBox1.Text;
            string ab = this.textBox2.Text;
            int count = name.Length;
            int typeId = Convert.ToInt32(this.comboBox1.SelectedValue);
            string url = this.textBox4.Text;
            string sql = string.Format("insert into song_info(song_name,song_ab,song_word_count,songtype_id,singer_id,song_url,song_play_count) values('{0}','{1}',{2},{3},{4},'{5}',{6})", name, ab, count, typeId, id, url, 0);
              //创建命令
            SqlCommand cmd = new SqlCommand(sql,db.Connection);
            try
            {
                //打开数据库
                db.OpenConnection();
                int rade = cmd.ExecuteNonQuery();
                if (rade > 0)
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
                MessageBox.Show(ex.Message);
            }
            finally
            {
                db.CloseConnection();
            }
            }
        //保存
        private void btnOK_Click(object sender, EventArgs e)
        {
            if (What())
            {
                if (names == null)
                {
                    Addmusic();
                }
                else
                {
                    update();
                }
                this.Close();
            }
            
        }
        //主窗口
        private void FrmMusic_Load(object sender, EventArgs e)
        {
            infotype();
            this.textBox1.Text = name;
            this.textBox2.Text = ab;
            this.comboBox1.SelectedIndex = type;
            this.textBox4.Text = look;
            this.textBox3.Text = go;
            if (names!= null)
            {
                //显示文本框的内容
                showinfo();
            }
               
            //调用歌曲类型

           
        }
        //浏览
        private void btnLook_Click(object sender, EventArgs e)
        {
            OpenFileDialog open = new OpenFileDialog();
            open.InitialDirectory = Application.StartupPath;
            //
            open.Filter = "All files (*.*)|*.*|txt files (*.txt)|*.txt";
            if (open.ShowDialog() == DialogResult.OK)
            {
                string url = open.FileName.ToString();
                this.textBox4.Text = url.Substring(url.LastIndexOf('\\') + 1);
            }
        }
        //查询
        private void btnSelect_Click(object sender, EventArgs e)
        {
             FrmsingerName singer = new FrmsingerName();
            singer.name = this.textBox1.Text;
            singer.ab = this.textBox2.Text;
            singer.type = this.comboBox1.SelectedIndex;
            singer.look = this.textBox4.Text;
            singer.MdiParent = this.MdiParent;
            singer.value = this.textBox3.Text;
            singer.names = names;
            singer.Show();
            this.Close();
        }
        //显示文本框
        public void showinfo()
        {
            string sql = string.Format(@"select song_ab,songtype_id,singer_name,song_url from song_info,singer_info where singer_info.singer_id=song_info.singer_id and song_name='{0}'", names);
            SqlCommand cmd = new SqlCommand(sql,db.Connection);
            try
            {
                db.OpenConnection();
                SqlDataReader rade = cmd.ExecuteReader();
                if (rade.Read())
                {
                    this.textBox1.Text = names;
                    this.textBox2.Text = rade["song_ab"].ToString();
                    this.comboBox1.SelectedValue = (int)rade["songtype_id"];
                    this.textBox3.Text = rade["singer_name"].ToString();
                    this.textBox4.Text = rade["song_url"].ToString();
                }
                rade.Close();

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
        //修改
        public void update()
        {
            chaxun();
            string ab = this.textBox2.Text;
            int count = names.Length;
            int typeId = Convert.ToInt32(this.comboBox1.SelectedValue);
            string url = this.textBox4.Text;
            string sql = string.Format("update song_info set song_ab='{1}',song_word_count={2},songtype_id={5},singer_id={3},song_url='{4}' where song_name='{0}'", names, ab, count, id, url, typeId);
            SqlCommand com = new SqlCommand(sql, db.Connection);
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
                db.CloseConnection();
            }
        }

        private void btnNo_Click(object sender, EventArgs e)
        {
            this.Close();
        }
    }
}
