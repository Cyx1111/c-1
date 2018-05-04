using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace s2_003
{
    public partial class Frmmian : Form
    {
        public Frmmian()
        {
            InitializeComponent();
        }
        //新建集合
        public List<se> ss = new List<se>();

        private void Frmmian_Load(object sender, EventArgs e)
        {
           //实例化对象，给他们初始值
            se x = new se();
            x.Id = 1;
            x.Name = "店小一";
            x.Age = 3;
            x.sex = "男";

            se x1 = new se();
            x1.Id = 2;
            x1.Name = "大运";
            x1.Age = 23;
            x1.sex = "男";
            ss.Add(x);
            ss.Add(x1);
            //绑定dataGridView数据
            dataGridView1.DataSource = new BindingList<se>(ss);

        }
        public void bindgrid(List<se> ss)
        {
            //刷新datagridview数据
            this.dataGridView1.DataSource = new BindingList<se>(ss);
        }

        private void 新增ToolStripMenuItem_Click(object sender, EventArgs e)
        {
            frmci frm = new frmci();
            frm.frmparent = this;
            frm.ShowDialog();

        }

        private void 删除ToolStripMenuItem_Click(object sender, EventArgs e)
        {
            if (this.dataGridView1.SelectedRows.Count > 0)
            {
                DialogResult choice = MessageBox.Show("确定要删除吗？", "提示", MessageBoxButtons.OKCancel);
                if (choice == DialogResult.OK)
                {
                    string id = this.dataGridView1.SelectedRows[0].Cells[0].Value.ToString();//拿到选中的员工号进行删除
                    for (int i = 0; i < ss.Count; i++)
                    {
                        if (ss[i].Id.ToString() == id)
                        {
                            //执行删除操作
                            ss.Remove(ss[i]);
                            //刷新DataGridView
                            bindgrid(ss);
                            MessageBox.Show("删除成功！");
                        }
                    }
                }
                else
                {
                    MessageBox.Show("请选择一行！");
                    return;
                }
            }

        }

        private void 打卡记录ToolStripMenuItem_Click(object sender, EventArgs e)
        {
            frmdidi fm = new frmdidi();
            fm.frmparent = this;
            fm.ShowDialog();

        }

        private Dictionary<string, Record> rec = new Dictionary<string, Record>();
        private void 签到ToolStripMenuItem_Click(object sender, EventArgs e)
        {
            //判断是否选中一行
            if (this.dataGridView1.SelectedRows.Count != 1)
            {
                MessageBox.Show("请选中一行！");
                return;
            }
            string workNo = dataGridView1.CurrentRow.Cells[0].Value.ToString();
            //遍历Key值
            foreach (string item in rec.Keys)
            {
                if (workNo == item)
                {
                    MessageBox.Show("您已经签到过！");
                    return;
                }
            }
            Record record = new Record();

            record.Id = workNo;//id号

            record.Name = dataGridView1.CurrentRow.Cells[1].Value.ToString();//获取选中的姓名
            record.Intime = DateTime.Now;//当前的时间
            this.rec.Add(record.Id, record);//添加到记录里
            MessageBox.Show("签到成功！");

        }

        private void 签退ToolStripMenuItem_Click(object sender, EventArgs e)
        {
            if (this.dataGridView1.SelectedRows.Count != 1)
            {
                MessageBox.Show("请选择一行！");
                return;
            }
            string ID = dataGridView1.CurrentRow.Cells[0].Value.ToString();
            bool isOut = false;//标识是否已经签到过
            foreach (string item in rec.Keys)
            {
                if (item == ID)
                {
                    this.rec[item].Outtime = DateTime.Now;
                    MessageBox.Show("签退成功！");
                    isOut = true;
                    break;
                }
            }


            if (!isOut)
            {
                MessageBox.Show("很抱歉，尚未签到！");
            }

        }
    }
}
