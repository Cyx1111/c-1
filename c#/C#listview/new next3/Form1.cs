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
    public partial class Frmabout : Form
    {
        int index = 0;
        public Frmabout()
        {
            InitializeComponent();
        }

        private void pictureBox1_Click(object sender, EventArgs e)
        {
            

        }

        private void timer1_Tick(object sender, EventArgs e)
        {
            if (index < this.imageList1.Images.Count - 1)
            {
                index++;
            }
            else {
                index = 0;
            }
            this.pictureBox1.Image = imageList1.Images[index];
        }
    }
}
