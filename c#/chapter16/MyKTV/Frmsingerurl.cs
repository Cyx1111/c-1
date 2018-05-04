using System;
using System.Collections;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Data.SqlClient;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace MyKTV
{
    public partial class Frmsingerurl : Form
    {
        public Frmsingerurl()
        {
            InitializeComponent();
        }
        DBHelper db = new DBHelper();
        string url;//获得的歌手的路径

        private void Frmsingerurl_Load(object sender, EventArgs e)
        {
            singerurl();
            this.txtOld.Text = url;
        }
        //退出
        private void btnNO_Click(object sender, EventArgs e)
        {
            this.Close();
        }
      
        //歌手的路径
        public void singerurl()
        {
            string sql = "select resource_path from Resource_Path where resource_type = '歌手'";
            SqlCommand cmd = new SqlCommand(sql,db.Connection);
            db.OpenConnection();
            try
            {
                SqlDataReader rade = cmd.ExecuteReader();
                if (rade.Read())
                {
                    url = rade["resource_path"].ToString();
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
        //照片的路径
        private bool Path()
        {
            try
            {
                string sql = "select singer_phone_url from singer_info";
                SqlCommand com = new SqlCommand(sql, db.Connection);
                db.OpenConnection();
                SqlDataReader reader = com.ExecuteReader();
                //初始化Array类的新实例，为空，默认初始容量
                ArrayList list = new ArrayList();
                while (reader.Read())
                {
                    list.Add(reader["singer_phone_url"]);
                }
                reader.Close();
                for (int i = 0; i < list.Count; i++)
                {
                    //
                    string oldPath, newPath;
                    oldPath = url + list[i].ToString();

                    //获取当前路径
                    //Application.StartupPath

                    newPath = this.txtNew.Text + "\\" + list[i].ToString();                
                    File.Move(oldPath, newPath);
                }
                return false;
            }
            catch (Exception)
            {          
                return true;
            }

        }
        //浏览
        private void btnLook_Click(object sender, EventArgs e)
        {
            //打开文本框folderBrowserDialog1用默认的所有者运行通用对话框
            DialogResult dr = folderBrowserDialog1.ShowDialog();
            if (dr == System.Windows.Forms.DialogResult.OK)
            {
                //获取或设置指定的路径
                string path = folderBrowserDialog1.SelectedPath;
                //
                this.txtNew.Text = path;
            }
        }
        //更改的新路径
        private void Add()
        {
            //
            string sql = string.Format("update Resource_Path set resource_path='{0}'  where resource_type='歌手'", (this.txtNew.Text));
            SqlCommand com = new SqlCommand(sql, db.Connection);
            try
            {
                db.OpenConnection();
                int chose = com.ExecuteNonQuery();
                if (chose > 0)
                {
                    MessageBox.Show("资源路径更换成功！");
                }
                else
                {
                    MessageBox.Show("资源路径更换失败！");
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

        private void btnOK_Click(object sender, EventArgs e)
        {
            if (Path())
            {
                Add();
            }
        }

    }
}
