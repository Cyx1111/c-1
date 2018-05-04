using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace new_next3
{
    public partial class demo4 : Form
    {
        public demo4()
        {
            InitializeComponent();
        }

        private void demo4_Load(object sender, EventArgs e)
        {
             {

//            txt1.Text = num.ToString();
//            txt2.Text = name;
//            txt3.Text = pwd;
//            txt4.Text = dengji;
//            txt5.Text = email;
//            txt6.Text = day;
//            if (txt1.Text == "0")
//            {
//                this.Text = "新增学生新建";
//                but1.Text = "新增";
//            }
//            else {
//                this.Text = "修改学生新建";
//                but1.Text = "修改";
//            }
//        }
//        public string con = "Data Source=.;Initial Catalog=QQDB;Integrated Security=True";
//        private void but1_Click(object sender, EventArgs e)
//        {
//            if (but1.Text == "修改")
//            {
//                  SqlConnection conn=new SqlConnection(con);
//             conn.Open();
//             string sql = "update UserInfo set [UserName]='" + txt2.Text + "',[UserPwd]='" + txt3.Text + "',[LevelId]='" + txt4.Text + "',[Email]='" + txt5.Text + "',[OnLineDay]='" + txt6.Text + "' where [UserId]='" + txt1.Text + "' ";
//            try 
//           {	        
//            SqlCommand cmd=new SqlCommand(sql,conn);
//            int num = cmd.ExecuteNonQuery();
//            if (num > 0)
//            {
//                MessageBox.Show("修改成功!");
//            }
//            else
//            {
//                MessageBox.Show("修改失败！");
//            }
//           }
//            catch (Exception)
//            {

//                MessageBox.Show("异常！", "提示", MessageBoxButtons.OK, MessageBoxIcon.Information);
//            }
//            finally
//            {
//                conn.Close();
//            }

//            }
//            else if(but1.Text=="新增") {
//                SqlConnection conn = new SqlConnection(con);
//                conn.Open();
//                string sql = "insert into  UserInfo ([UserName],[UserPwd],[LevelId],[Email],[OnLineDay])values('"+txt2.Text+"','"+txt3.Text+"','"+txt4.Text+"','"+txt5.Text+"','"+txt6.Text+"')";
//                try
//                {
//                    SqlCommand cmd = new SqlCommand(sql, conn);
//                    int num = cmd.ExecuteNonQuery();
//                    if (num > 0)
//                    {
//                        MessageBox.Show("增加成功!");
//                    }
//                    else
//                    {
//                        MessageBox.Show("增加失败！");
//                    }
//                }
//                catch (Exception)
//                {
//                    MessageBox.Show(sql);
//                    MessageBox.Show("异常！", "提示", MessageBoxButtons.OK, MessageBoxIcon.Information);
//                }
//                finally
//                {
//                    conn.Close();
//                }

//            }
//        }
//    }
//}

//骚猪 2018/3/7 15:49:26
// {
//            xiugai();
//        }


//        }
//    }
//}
