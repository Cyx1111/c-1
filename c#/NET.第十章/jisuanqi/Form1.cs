using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace jisuanqi
{
    public partial class Form1 : Form
    {
        public Form1()
        {
            InitializeComponent();
        }

        private void Form1_Load(object sender, EventArgs e)
        {





        }

        private void button1_Click(object sender, EventArgs e)
        {

            int right = Convert.ToInt32(textBox1.Text);
            int left = Convert.ToInt32(textBox1.Text);
            string oper = comboBox1.ToString();
            count co = CalculatorFactory.getInstance(oper);
           
            try
            {
                int result = co.Calc();
                textBox3.Text = result.ToString();
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message);
                textBox3.Text = "";

                throw;
            }
            co.Right = right;
            co.Left = left;
        }
    }
}
