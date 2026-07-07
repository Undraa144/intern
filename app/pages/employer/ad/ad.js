import {Card, Tag, Button ,  Divider} from "antd";
import {
    EditOutlined,
    DeleteOutlined,
    DollarOutlined ,
    TeamOutlined ,
    EyeOutlined ,
    CalendarOutlined ,
} from "@ant-design/icons"

import styles from "./ad.module.scss"

export default function Ad(){
    return(
    <div className={styles.main}>    
        <div className={styles.button}>
            <Button style={{background:"rgb(88, 158, 255)",color:"#ffffff", height:"40px", width:"70px"}} >
                +
            </Button>
        </div>
        <Card className={styles.jobCard}>
        
        <div className={styles.top}>
            <div>
            <h3>
                Frontend хөгжүүлэгч дадлагажигч
                <Tag color="success">Идэвхтэй</Tag>
            </h3>

            <p>
                React болон Next.js ашиглан дотоод бүтээгдэхүүний
                интерфейс хөгжүүлэх багт нэгдэнэ.
            </p>
            </div>

            <div className={styles.actions}>
            <EditOutlined />
            <DeleteOutlined />
            </div>
        </div>

        <div className={styles.meta}>
            <span>
            <DollarOutlined />
            800 - 1200 мянга ₮
            </span>

            <span>
            <TeamOutlined />
            2 орон тоо
            </span>

            <span>
            <EyeOutlined />
            142 үзэлт
            </span>

            <span>
            <CalendarOutlined />
            2026.07.20 хүртэл
            </span>
        </div>

        <Divider />

        <Button>Хаах</Button>
        </Card>
    </div>
    )
}