"use client";

import Image from 'next/image'
import { Input } from 'antd';
import {AutoComplete} from 'antd';
import {Row , Col , Card} from 'antd';
import styles from './home.module.scss';

const { Search } = Input;

export default function Home() {
const onSearch = (value) => { console.log(value); }; 
const options = [ 
    { value: 'It' }, 
    { value: 'Marketing' }, 
    { value: 'Design' }, ];
  return (
    <div className={styles.main}> 
        <div className={styles.left}> 
            <h1 > 
                Find a job that suits your interests & skills 
            </h1> 
            <p className={styles.description}> 
                This is the main content of the home page. 
            </p> 
            <AutoComplete classNames={{ popup: { root: 'certain-category-search-dropdown', }, }} 
            popupMatchSelectWidth={500} style={{ width: 250 }} options={options} > 
            <Input.Search size="large" placeholder="input here" /> 
            </AutoComplete> 
        </div> 
        <div className={styles.right}> 
            <img src="/home.jpeg" alt="Home Image" className={styles.image} /> 
        </div> 
        <div className={styles.stats}>
        <div className={styles.statCard}>
            <div className={styles.iconBox}>
            <Image
                src="/job.jpeg"
                alt="job"
                width={40}
                height={40}
            />
            </div>

            <div className={styles.content}>
            <h3>1</h3>
            <p>Live Job</p>
            </div>
        </div>

        <div className={styles.statCard}>
            <div className={styles.iconBox}>
            <Image
                src="/company.jpeg"
                alt="company"
                width={40}
                height={40}
            />
            </div>

            <div className={styles.content}>
            <h3>1</h3>
            <p>Companies</p>
            </div>
        </div>

        <div className={styles.statCard}>
            <div className={styles.iconBox}>
            <Image
                src="/job.jpeg"
                alt="job"
                width={40}
                height={40}
            />
            </div>

            <div className={styles.content}>
            <h3>1</h3>
            <p>New Jobs</p>
            </div>
        </div>
        </div>
    </div>
  );
}