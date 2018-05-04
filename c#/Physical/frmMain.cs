using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace Physical
{
    public partial class frmMain : Form
    {
        public frmMain()
        {
            InitializeComponent();
        }

        #region 初始化数据
        /// <summary>
        /// 初始化数据
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void Form1_Load(object sender, EventArgs e)
        {
            dataGridView1.AutoGenerateColumns = false;
            cobXiang.Items.Add("请选择");
            cobXiang.SelectedIndex = 0;
            RenovateItem();// 更新检查项目列表
            HealthCheckSet set = new HealthCheckSet();
            RenovateList();//更新套餐列表
            cobLie.SelectedIndex = 0;
            cobXiang.Enabled = true;
            btnAdd.Enabled = true;
            btnDelete.Enabled = true;

        }
        #endregion

        #region 更新检查项目列表
        /// <summary>
        /// 更新检查项目列表
        /// </summary>
        private void RenovateItem()
        {
            foreach (KeyValuePair<string, HealthCheckItem> item in HealthCheckItem.ItemDic)
            {
                cobXiang.Items.Add(item.Key);
            }
        }
        #endregion

        #region  更新套餐列表
        /// <summary>
        /// 更新套餐列表
       /// </summary>
        private void RenovateList()
        {
            cobLie.Items.Clear();
            cobLie.Items.Add("请选择");
            foreach (KeyValuePair<string, List<HealthCheckItem>> item in HealthCheckSet.SetDic)
            {
                cobLie.Items.Add(item.Key);
            }
            if (cobLie.Items.Count > 2)
            {
                cobLie.SelectedIndex = cobLie.Items.Count - 1;
            }
        }
        #endregion

        #region 套餐列表下拉框
        /// <summary>
        /// 套餐列表下拉框
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void cobLie_SelectedIndexChanged(object sender, EventArgs e)
        {
             if (cobLie.SelectedIndex > 0)
            {
                lblName2.Text = cobLie.Text;//选择套餐列表时给套餐名赋值
                cobXiang.Enabled = true;
                RenovateDGV();//刷新列表
            }
            else
            {
                cobXiang.Enabled = true;
            }

            

        }
        #endregion

        #region 刷新RenovateDGV列表
        /// <summary>
        /// 刷新RenovateDGV列表
        /// </summary>
        private void RenovateDGV()
        {
            List<HealthCheckItem> list = HealthCheckSet.SetDic[cobLie.Text];
            dataGridView1.DataSource = new BindingList<HealthCheckItem>(HealthCheckSet.SetDic[cobLie.Text]);
            lblPrice1.Text = Price(cobLie.Text).ToString();//价格
        }
        #endregion

        #region 项目总金额
        /// <summary>
        /// 项目总金额
        /// </summary>
        /// <param name="key"></param>
        /// <returns></returns>
        private int Price(string key)
        {
            int sum = 0;
            foreach (HealthCheckItem item in HealthCheckSet.SetDic[key])
            {
                sum += item.Price;
            }
            return sum;
        }
        #endregion

        #region 添加检查项目
        /// <summary>
        /// 添加检查项目
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void btnAdd1_Click(object sender, EventArgs e)
        {
            if (HealthCheckSet.SetDic[cobLie.Text].Contains(HealthCheckItem.ItemDic[cobXiang.Text]))
            {
                MessageBox.Show(cobLie.Text + "套餐中已存在该检查项目!", "错误", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
            else
            {
                HealthCheckSet.DicAdd(HealthCheckSet.SetDic[cobLie.Text], cobXiang.Text);
                RenovateDGV();
            }
          
        }
        #endregion

        #region  检查项目列表
        /// <summary>
        /// 检查项目列表
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void cobXiang_SelectedIndexChanged(object sender, EventArgs e)
        {
            if (cobXiang.SelectedIndex > 0)
            {
                btnAdd1.Enabled = true;
            }
            else
            {
                btnAdd1.Enabled = false;
                btnDelete.Enabled = false;
            }


        }
        #endregion

        #region 删除
        /// <summary>
        /// 删除
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void btnDelete_Click(object sender, EventArgs e)
        {
            DialogResult result = MessageBox.Show("您确定要删除吗?", "警告!", MessageBoxButtons.OKCancel, MessageBoxIcon.Information);
            if (result == DialogResult.OK)
            {
                if (dataGridView1.SelectedRows[0] != null && dataGridView1.SelectedRows[0].Cells[0] != null && dataGridView1.SelectedRows[0].Cells[0].Value != null)
                {
                    //删除 套餐中所选的与内置检查项目相匹配的项
                    HealthCheckSet.SetDic[cobLie.Text].Remove(HealthCheckItem.ItemDic[dataGridView1.SelectedRows[0].Cells[0].Value.ToString()]);
                    RenovateDGV();
                }
            }

        }
        #endregion

        #region 新建套餐
        /// <summary>
        /// 新建套餐
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void btnAdd_Click(object sender, EventArgs e)
        {
            if (txtName.Text != "")
            {
                foreach (string item in HealthCheckSet.SetDic.Keys)
                {
                    if (txtName.Text.Equals(item))
                    {
                        MessageBox.Show("已经存在" + txtName.Text + "套餐!");
                        return;
                    }
                }
                HealthCheckSet dic = new HealthCheckSet(txtName.Text);
                RenovateList();
            }
        

        }
        #endregion
        private void groupBox2_Enter(object sender, EventArgs e)
        {

        }

        private void txtName_TextChanged(object sender, EventArgs e)
        {

        }
    }
}
