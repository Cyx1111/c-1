using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace NET.第十章
{
    public partial class Form1 : Form
    {
        public Form1()
        {
            InitializeComponent();
        }

        //出租的车辆集合
        private Dictionary<string, Vehicle> vehicles = new Dictionary<string, Vehicle>();
        //还车的集合
        private Dictionary<string, Vehicle> rentvehicle = new Dictionary<string, Vehicle>();

        private void Form1_Load(object sender, EventArgs e) //一.初始化信息vehicle是父类
        {
            Vehicle veh = new Car("红色", "奥迪A6", "333", 111111, "2");
            Vehicle veh1 = new Car("百色", "奥迪6", "222", 55555, "2");
            Vehicle veh2 = new Car("酷色", "奥迪A", "220", 333333, "2");
            Vehicle tr = new Truck("大运", "银灰色", "110", 666666, "4", 3);
            //二.把初始化的信息加在出租的车中(出租的车的集合）
            vehicles.Add(veh.Id.ToString(), veh);
            vehicles.Add(veh1.Id.ToString(), veh1);
            vehicles.Add(veh2.Id.ToString(), veh2);
            vehicles.Add(tr.Id.ToString(), tr);
            //三.绑定在listview中
            Show(vehicles, listView1);


            //下拉框
            this.comboBox1.Items.Add("红色");
            this.comboBox1.Items.Add("蓝色");
            this.comboBox1.Items.Add("白色");
            this.comboBox1.Items.Add("黑色");
            this.comboBox1.Items.Add("灰色");
            this.tetzhong.Enabled = false;



        }

        public void Show(Dictionary<string, Vehicle> vehicles, ListView list) //三.循环遍历把出租的车的集合绑定在listview1中，
        {
            //循环之前先清空
            list.Items.Clear();
            foreach (Vehicle vehicle in vehicles.Values)
            {
                ListViewItem lv = new ListViewItem();
                lv.Text = vehicle.Id.ToString();
                lv.SubItems.Add(vehicle.Name);
                lv.SubItems.Add(vehicle.Color);
                lv.SubItems.Add(vehicle.Datamoney);
                lv.SubItems.Add(vehicle.Datatime.ToString());


                //是卡车的话 在重量里面显示数量
                if (vehicle is Truck)
                {
                    lv.SubItems.Add((vehicle as Truck).Load.ToString());
                }
                else
                {
                    lv.SubItems.Add("无");

                }
                list.Items.Add(lv);
            }

        }

        private void butzu_Click(object sender, EventArgs e) //四.租车
        {
            string key = listView1.SelectedItems[0].Text;
            //Rentuser租户
            vehicles[key].Rentuser = this.textBox1.Text;
            //在还车的数组中添加这条数据，
            rentvehicle.Add(vehicles[key].Id.ToString(), vehicles[key]);
            if (vehicles.ContainsKey(key))
            {
                vehicles.Remove(key);
            }
            Show(vehicles, listView1);
            MessageBox.Show("租车成功！");
            this.textBox1.Clear();

        }

        private void butnew_Click(object sender, EventArgs e) //刷新
        {

            Show(vehicles, listView1);
        }

        public void Show1(Dictionary<string, Vehicle> rentvehicle, ListView list) //五.已经出租的车绑定在listview2中，
        {
            list.Items.Clear();
            foreach (Vehicle item in rentvehicle.Values)
            {
                ListViewItem lv = new ListViewItem();
                lv.Text = item.Id.ToString();
                lv.SubItems.Add(item.Name);
                lv.SubItems.Add(item.Color);
                lv.SubItems.Add(item.Datamoney);
                lv.SubItems.Add(item.Datatime.ToString());


                //是卡车的话 在重量里面显示数量
                if (item is Truck)
                {
                    lv.SubItems.Add((item as Truck).Load.ToString());
                }
                else
                {
                    lv.SubItems.Add("无");

                }
                list.Items.Add(lv);
            }
        }

        private void button1_Click(object sender, EventArgs e)//刷新
        {
            Show1(rentvehicle,listView2);
        }

        private void button2_Click(object sender, EventArgs e)//天数 
        {
            if(listView2.SelectedItems.Count==0)
            {
                MessageBox.Show("请选择一行！");
                return;
            }
           if(this.textBox2.Text==null)
           {
               MessageBox.Show("请输入天数");
               return;
           }
           //string key = listView2.SelectedItems[0].Text;
           //rentvehicle[key].Rentuser = this.textBox2.Text;
           ////调用抽象方法
           ////string  totalPrice = rentvehicle[key].Money();
           //string msg = string.Format("您的总价是{0}", totalPrice.ToString());
           //MessageBox.Show(msg, "提示", MessageBoxButtons.OK, MessageBoxIcon.Information);
           ////加入到可租车辆集合里
           //vehicles.Add(rentvehicle[key].Id.ToString(), rentvehicle[key]);
           ////从当前的集合中移除
           //if (rentvehicle.ContainsKey(key))
           //{
           //    rentvehicle.Remove(key);
           //}
           ////重新刷新列表
           //Show1(rentvehicle, listView2);
           ////租用天数赋空
           //this.textBox2.Text = "";


        }

        private void button3_Click(object sender, EventArgs e)
        {
             //友情判断
            if (limousine() == true)
            {
                //遍历车牌号
                foreach (string item in vehicles.Keys)
                {
                    
                    if (textBox1.Text == item)
                    {
                        
                        MessageBox.Show("该车牌号已经存在");
                        return;
                    }                  

                }
                Vehicle vs = null;
                //运用里氏替换原则
                if (radbutone.Checked == true)
                {
                  
                    vs = new Car();

                }
                else if (radbuttwo.Checked == true)
                {
                    Truck tr = new Truck();
                    tr.Load =Convert.ToInt32(tetzhong.Text);
                    vs = new Truck();
                    vs = tr;
                           

                }
                //01获取对应文本框中的值,
                vs.Id =Convert.ToInt32(tethao.Text) ;//车号1
                vs.Name = tettype.Text;//车型2
                vs.Color = comboBox1.Text;//颜色
                vs.Datatime= tettime.Text;//使用时间3
                vs.Datamoney = tetmoney.Text;//每日租金  4
                
                vehicles.Add(vs.Id.ToString(), vs);
                uptatetxt();
                MessageBox.Show("添加成功!");


           
            }
          
        }
        //卡车友情提示
        public bool truck()
        {
            if (radbutone.Checked == false&& radbuttwo.Checked == false)
            {
                MessageBox.Show("请选择车辆类型！");
                return false;
            }
            else if (tethao.Text == ""||tettype.Text == ""||comboBox1.Text == ""||tettime.Text == ""||tetmoney.Text == ""||tetzhong.Text == "")
            {
                MessageBox.Show("请填写完整！！");
                return false;
            }
            else
            {
                return true;  
            }
        }

        //轿车的友情提示
        public bool limousine()
        {
            if (radbutone.Checked == false && radbuttwo.Checked == false)
            {
                MessageBox.Show("请选择车辆类型！");
                return false;
            }
            else if (tethao.Text == "" || tettype.Text == "" || comboBox1.Text == "" || tettime.Text == "" || tetmoney.Text == "")
            {
                MessageBox.Show("请填写完整！！");
                return false;
            }
            else
            {
                return true;
            }
        }
        //轿车
        private void radioButton1_CheckedChanged(object sender, EventArgs e)
        {
            if (radbutone.Checked == true)
            {
                this.tetzhong.Enabled = false;
            }
        }
        //卡车
        private void radioButton2_CheckedChanged(object sender, EventArgs e)
        {
            if (radbuttwo.Checked == true)
            {
                this.tetzhong.Enabled = true;
            }
        }
        //当写完文本框赋空
        public void uptatetxt()
        {
            this.tethao.Text = "";
            this.tettype.Text = "";
            this.comboBox1.Text = "";
            this.tettime.Text = "";
            this.tetmoney.Text = "";
            this.tetzhong.Text = "";
        }
        }





    }



        
