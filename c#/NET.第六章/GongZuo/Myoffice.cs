using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace GongZuo
{
    public partial class Myoffice : Form
    {
        List<Employee> em = new List<Employee>();
        public Myoffice()
        {
            InitializeComponent();
            init();
        }
        public void init()
        {
            List<Job> li = new List<Job>();

            li.Add(new Job("编码","购物车模块"));
            li.Add(new Job("测试", "给购物车模块做单元测试"));
            SE ai = new SE("112", "爱编程", 25, Gender.girl, 100, li);

            List<Job> lis = new List<Job>();
            lis.Add(new Job("设计", "数据库建模"));
            lis.Add(new Job("编写文档", "详细设计说明书"));
            SE joe = new SE("113","Joe",30,Gender.gender,200,lis);

            PM pm = new PM("890","盖茨",50,Gender.gender,30,null);
            em.Add(ai);
            em.Add(joe);
            em.Add(pm);
        }
        private void Myoffice_Load(object sender, EventArgs e)
        {

        }

        private void button1_Click(object sender, EventArgs e)
        {
            foreach (Employee item in em)
            {
                if(item is PM)
                {
                    MessageBox.Show(((PM)item).DoWork(),"汇报");
                }
                if(item is SE)
                {
                    MessageBox.Show(((SE)item).DoWork(), "汇报");
                }
            }
        }
    }
}
