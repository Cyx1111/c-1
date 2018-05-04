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
    public partial class FrmSongurl : Form
    {
        public FrmSongurl()
        {
            InitializeComponent();
        }
        DBHelper db = new DBHelper();
        private void btnLook_Click(object sender, EventArgs e)
        {
            //
            DialogResult dr = folderBrowserDialog1.ShowDialog();
            if (dr==System.Windows.Forms.DialogResult.OK)
            {
                //
                 string path = folderBrowserDialog1.SelectedPath;
                this.txtNew.Text = path;
            }
        }
        string url;
        //查询歌曲大体路径
        public void songurl()
        {
            string sql = "select resource_path from Resource_Path where resource_type='歌曲'";
            SqlCommand cmd = new SqlCommand(sql,db.Connection);
            try
            {
                db.OpenConnection();
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
        //查询歌曲的具体的路径
        public bool Path()
        {
           
            
            try
            {
                string sql = "select song_url from song_info";
                SqlCommand cmd = new SqlCommand(sql, db.Connection);
                db.OpenConnection();
                SqlDataReader reader = cmd.ExecuteReader();

                ArrayList list = new ArrayList();
                while (reader.Read())
                {
                    list.Add(reader["song_url"]);
                }
                reader.Close();
                for (int i = 0; i < list.Count; i++)
                {
                    string oldPath, newPath;
                    oldPath = url + list[i].ToString();

                    //获取当前路径
                    //Application.StartupPath

                    newPath = this.txtNew.Text + "\\" + list[i].ToString();
                    File.Move(oldPath, newPath);
               
                }
                return true;
            }
            catch (Exception)
            {          
                return false;
            }   

        }
        //修改
        private void Add()
        {
            string sql = string.Format("update Resource_Path set resource_path='{0}'  where resource_type='歌曲'", (this.txtNew.Text));
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

        private void FrmSongurl_Load(object sender, EventArgs e)
        {
            songurl();
            this.txtOld.Text = url;
        }

        private void btnOK_Click(object sender, EventArgs e)
        {

            if (Path())
            { return; }
            Add();
        }

        private void btnNO_Click(object sender, EventArgs e)
        {
            this.Close();
        }

    }

}
