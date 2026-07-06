import styles from "./profile.module.scss";

export default function Profile(){
    return(
        <div className={styles.main}>
            <h1>
                Профайл
            </h1>
            <h2>
                Байгууллагын профайл
            </h2>
            <p>
                Оюутнуудад харагдах танай мэдээлэл
            </p>
            <div className={styles.card}>
                <h1>
                    hello
                </h1>
            </div>
        </div>
    )
}