using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace JIShuangQi
{
    public partial class Form1 : Form
    {
        public Form1()
        {
            InitializeComponent();
            this.comboBox1.SelectedIndex = 0;
        }

        private void label1_Click(object sender, EventArgs e)
        {

        }

        private void Form1_Load(object sender, EventArgs e)
        {

        }

        private void button1_Click(object sender, EventArgs e)
        {
            if(string.IsNullOrEmpty(this.textBox1.Text.Trim()))
            {
                MessageBox.Show("操作数不能为空！");
                this.textBox2.Focus();
                return;
            }
            try
            {
                Operation op = new Operation();
                switch(this.comboBox1.SelectedItem.ToString().Trim())
                {
                    case "+":
                        {
                            op = new OperationAdd();
                            break;
                        }
                    case "-":
                        {
                            op = new OperationAdd();
                            break;
                        }
                    case "*":
                        {
                            op = new OperationAdd();
                            break;
                        }
                    case "/":
                        {
                            op = new OperationAdd();
                            break;
                        }
                }
                op.NumberA = double.Parse(this.textBox1.Text.Trim());
                op.NumberA = double.Parse(this.textBox2.Text.Trim());
                this.label2.Text = op.GetResult().ToString();
                this.label2.Visible = true;
                this.label1.Visible = true;

            }
            catch (Exception ex)
            {

                MessageBox.Show("发生错误!"+ex.Message);
            }
        }
    }
}
