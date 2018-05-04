using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace myschool
{
    public partial class Form2 : Form
    {
        public Form2()
        {
            InitializeComponent();
        }

        private void Form2_Load(object sender, EventArgs e)
        {
            BackColor = Color.Red;
           
        }

        private void Form2_Click(object sender, EventArgs e)
        {

            if (this.BackColor == Color.Red)
            {
                this.BackColor = Color.Pink;
            }
            else if (this.BackColor == Color.Pink)
            {
                this.BackColor = Color.Black;
            }
            else if (this.BackColor ==Color.Black)
            {
                this.BackColor = Color.Green;
            }else{
                this.BackColor = Color.Red;
            }
        }
    }
}
