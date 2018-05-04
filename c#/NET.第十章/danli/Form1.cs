using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace danli
{
    public partial class Form1 : Form
    {
        public Form1()
        {
            InitializeComponent();
        }

        public string path;
        public static Form1 onlyOne;
        private void Form1_Load(object sender, EventArgs e)
        {

        }

        public void Playsong()
        {
        axWindowsMediaPlayer1.URL = path;
        }

        public static Form1 getInstance()
        {
            if (onlyOne == null)
            {
                onlyOne = new Form1();
            }
            return onlyOne;
        }

        private void axWindowsMediaPlayer1_Enter(object sender, EventArgs e)
        {

        }
    }
}
